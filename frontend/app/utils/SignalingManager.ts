import { B24hrTicker, BTicker } from "./types";


const BASE_URL = "wss://stream.binance.com/stream"

export class SignalingManager {
  private ws: WebSocket;
  private static instance: SignalingManager;
  private bufferedMessages: any[] = [];
  private callbacks: any = {};
  private id: number;
  private initialized: boolean = false;

  private constructor() {
    this.ws = new WebSocket(BASE_URL);
    this.bufferedMessages = []
    this.callbacks = {}
    this.id = 1
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager()
    }
    return this.instance;
  }

  init() {
    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.initialized = true
      this.bufferedMessages.forEach(messsage => {
        this.ws.send(JSON.stringify(messsage))
      })
      this.bufferedMessages = []
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      let type : string  = ''
      if(message.data){
        type = message?.data.e
      }
      

      if (this.callbacks[type]) {
        this.callbacks[type].forEach(({ callback } : any) => {

          if (type === "24hrTicker") {

            const newTicker: Partial<B24hrTicker> = {
                symbol: message.data.s,
                priceChange: parseFloat(message.data.p), 
                priceChangePercent: parseFloat(message.data.P), 
                lastPrice: parseFloat(message.data.c), 
                highPrice:parseFloat( message.data.h), 
                lowPrice: parseFloat(message.data.l),  
                volume: parseFloat(message.data.v), 
            };

            callback(newTicker);
          // console.log("WebSocket Message is", message)
        }

        if(type === 'depthUpdate'){

          const newBids: [string, string][] = message.data.b
          const newAsks : [string, string][] = message.data.
          a

          const data : { Bids : [string, string][], Asks : [string, string][] } = {
            Bids : newBids,
            Asks : newAsks
          }

          callback(data)

        }

    if (type === "trade") {
    callback(message.data);
}


  })

}

  }

  
}

sendMessage(message: any) {
    const messageToSend = {
      ...message,
      id: this.id++
    }
    if (!this.initialized) {
      this.bufferedMessages.push(messageToSend);
      return;
    }
    this.ws.send(JSON.stringify(messageToSend));
  }

  async registerCallback(type: string, callback: any, id: string) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push({ callback, id });
    // "ticker" => callback
  }

  async deRegisterCallback(type: string, id: string) {
    if (this.callbacks[type]) {
      const index = this.callbacks[type].findIndex(callback => callback.id === id);
      if (index !== -1) {
        this.callbacks[type].splice(index, 1);
      }
    }
  }
}

