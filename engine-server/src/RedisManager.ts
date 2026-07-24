import { RedisClientType } from "@redis/client";
import { createClient, RedisClient } from "redis";
import { SendMessageToAPI } from "./types/engine.types";



export class RedisManager {

    private publisherClient: RedisClientType
    private queueClient: RedisClientType

    private static instance: RedisManager

    private constructor() {
        this.publisherClient = createClient()
        this.publisherClient.connect()
        this.queueClient = createClient()
        this.queueClient.connect()
    }



    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager
        }
        return this.instance
    }

    public sendToQueue(message: any) {
        this.queueClient.lPush("db_processor", JSON.stringify(message));
        console.log("Message send to db Queue", message)

    }

    public sendToApi(clientId: string, message: SendMessageToAPI) {
        this.publisherClient.publish(clientId, JSON.stringify(message))
    }


}