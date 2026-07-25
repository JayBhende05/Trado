import WebSocket from "ws";
import { SubscriptionManager } from "./managers/SubscriptionManager";

export class User {
    private ws: WebSocket
    private id: string

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws
        this.addListener()
    }


    public emit(message: any) {
        this.ws.send(JSON.stringify(message))
    }


    public addListener() {
        this.ws.on("message", (message: any) => {

            const parsedData = JSON.parse(message);
            console.log("PArsed WS data is", parsedData);
            if (parsedData.method === 'SUBSCRIBE') {
                parsedData.params.forEach((field: string) => SubscriptionManager.getInstance().Subscribe(this.id, field));
            }

            if (parsedData.method === 'UNSUBSCRIBE') {
                parsedData.params.forEach((field: string) => SubscriptionManager.getInstance().Unsubscribe(this.id, field));
            }
        })
    }


}