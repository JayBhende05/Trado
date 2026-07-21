import { RedisClientType } from "@redis/client";
import RedisClient from "@redis/client/dist/lib/client/index.js";
import { createClient } from "redis";



export class RedisManger {

    private subscriberClient: RedisClientType
    private publisherClient: RedisClientType


    private static instance: RedisManger


    private constructor() {
        this.subscriberClient = createClient();
        this.subscriberClient.connect();
        this.publisherClient = createClient();
        this.publisherClient.connect();
    }



    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManger();
        }
        return this.instance;
    }


    public async Subscriber(userId: string) {
        await this.subscriberClient.subscribe(userId, (mesg) => {
            console.log("MEssage Received is", mesg);
        })

        console.log("Sucessfully Subscribe");
    }

    public async Publisher(userId: string, data: any) {
        await this.publisherClient.publish(userId, data);
        console.log("Sucessfully Publish")
    }

}