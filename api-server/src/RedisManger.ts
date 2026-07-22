import { RedisClientType } from "@redis/client";
import RedisClient from "@redis/client/dist/lib/client/index.js";
import { createClient } from "redis";



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



    public sendAndAwait(message: any) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            console.log("GENREATED ID", id)
            this.subscriberClient.subscribe(id, (message) => {
                this.subscriberClient.unsubscribe(id);
                resolve(JSON.parse(message))
            })
            this.queueClient.lPush("message", JSON.stringify({ clientId: id, data: message }))
        })
    }

    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }




}