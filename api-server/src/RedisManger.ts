import { RedisClientType } from "@redis/client";
import RedisClient from "@redis/client/dist/lib/client/index.js";
import { createClient } from "redis";
import { AwaitedMessageFromEngine, sendToApiTypes } from "./types/redismanger.types.js";




export class RedisManager {

    private subscriberClient: RedisClientType
    private queueClient: RedisClientType


    private static instance: RedisManager


    private constructor() {
        this.subscriberClient = createClient();
        this.subscriberClient.connect();
        this.queueClient = createClient();
        this.queueClient.connect();
    }



    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }



    public sendAndAwait(message: sendToApiTypes): Promise<AwaitedMessageFromEngine> {
        return new Promise<AwaitedMessageFromEngine>((resolve) => {
            const id = this.getRandomClientId();
            console.log("Subscribed to Pub/Sub with Id", id)
            this.subscriberClient.subscribe(id, (message) => {
                console.log("Receieved Message from Publisher")
                this.subscriberClient.unsubscribe(id);
                console.log("Unsubscribed to Pub/Sub with Id", id)
                resolve(JSON.parse(message))
                console.log("--------------END-----------------")

            })
            this.queueClient.lPush("message", JSON.stringify({ clientId: id, data: message }))
            console.log("Added to Queue")
        })
    }

    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }




}