import { B24hrTicker, BTicker } from "./types";


const BASE_URL = "ws://localhost:3004"

export class SignalingManager {
  private ws!: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callbacks: any = {};
  private id: number;
  private initialized: boolean = false;
  private subscribedStreams: Set<string> = new Set();

  private constructor() {
    this.id = 1;
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager();
    } else if (
      this.instance.ws.readyState === WebSocket.CLOSED ||
      this.instance.ws.readyState === WebSocket.CLOSING
    ) {
      console.log("WebSocket is closed or closing. Reconnecting...");
      this.instance.reconnect();
    }
    return this.instance;
  }

  private reconnect() {
    this.initialized = false;
    this.subscribedStreams.clear();
    this.init();
  }

  init() {
    this.ws = new WebSocket(BASE_URL);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.initialized = true;

      this.resubscribeAll();

      this.bufferedMessages.forEach((messsage) => {
        this.ws.send(JSON.stringify(messsage));
      });
      this.bufferedMessages = [];
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.initialized = false;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch (err) {
        console.log("Received non-JSON websocket message:", event.data);
        return;
      }
      console.log("WS parsed message:", message);
      let type: string = "";
      if (message.data) {
        type = message?.data.e;
        if (type === "depth") {
          type = "depthUpdate";
        }
      }

      if (this.callbacks[type]) {
        this.callbacks[type].forEach(({ callback, id }: any) => {
          if (id && message.stream && id !== message.stream) {
            return;
          }

          if (type === "24hrTicker") {
            const newTicker: Partial<B24hrTicker> = {
              symbol: message.data.s,
              priceChange: parseFloat(message.data.p),
              priceChangePercent: parseFloat(message.data.P),
              lastPrice: parseFloat(message.data.c),
              highPrice: parseFloat(message.data.h),
              lowPrice: parseFloat(message.data.l),
              volume: parseFloat(message.data.v),
            };

            callback(newTicker);
            // console.log("WebSocket Message is", message)
          }

          if (type === "depthUpdate") {
            const newBids: [string, string][] = message.data.b;
            const newAsks: [string, string][] = message.data.a;

            const data: { Bids: [string, string][]; Asks: [string, string][] } = {
              Bids: newBids,
              Asks: newAsks,
            };

            callback(data);
          }

          if (type === "trade") {
            callback(message.data);
          }

          if (type === "kline") {
            callback(message.data.k);
          }
        });
      }
    };
  }

  private resubscribeAll() {
    const activeStreams = new Set<string>();
    Object.values(this.callbacks).forEach((cbList: any) => {
      cbList.forEach((cb: any) => {
        if (cb.id) activeStreams.add(cb.id);
      });
    });

    if (activeStreams.size > 0) {
      const params = Array.from(activeStreams);
      console.log("Resubscribing to streams on connection open:", params);
      params.forEach((p) => this.subscribedStreams.add(p));

      this.ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params,
          id: this.id++,
        })
      );
    }
  }

  sendMessage(message: any) {
    const { method, params } = message;

    if (method === "SUBSCRIBE" && params) {
      const newParams = params.filter((p: string) => !this.subscribedStreams.has(p));
      if (newParams.length === 0) {
        return; // Already subscribed
      }
      newParams.forEach((p: string) => this.subscribedStreams.add(p));
      message.params = newParams;
    }

    if (method === "UNSUBSCRIBE" && params) {
      const unsubscribeParams = params.filter((p: string) => {
        const hasActiveCallback = Object.values(this.callbacks).some((cbList: any) =>
          cbList.some((cb: any) => cb.id === p)
        );
        return !hasActiveCallback;
      });
      if (unsubscribeParams.length === 0) {
        return; // Callback still active
      }
      unsubscribeParams.forEach((p: string) => this.subscribedStreams.delete(p));
      message.params = unsubscribeParams;
    }

    const messageToSend = {
      ...message,
      id: this.id++,
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(messageToSend));
    } else {
      if (method !== "SUBSCRIBE" && method !== "UNSUBSCRIBE") {
        this.bufferedMessages.push(messageToSend);
      }
    }
  }

  async registerCallback(type: string, callback: any, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
  }

  async deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      const index = this.callbacks[type].findIndex((callback: any) => callback.id === id);
      if (index !== -1) {
        this.callbacks[type].splice(index, 1);
      }
    }
  }
}

