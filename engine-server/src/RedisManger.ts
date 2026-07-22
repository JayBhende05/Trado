import { RedisClientType } from "@redis/client";
import { createClient, RedisClient } from "redis";



export class RedisManger {

    private publisherClient: RedisClientType
    private queueClient: RedisClientType

    private static instance: RedisManger

    private constructor() {
        this.publisherClient = createClient()
        this.queueClient = createClient()

    }

    private init() {
        this.publisherClient.connect();
        this.queueClient.connect();
    }

    public static async getInstance() {
        if (!this.instance) {
            this.instance = new RedisManger
            await this.instance.init();
        }
        return this.instance
    }





}