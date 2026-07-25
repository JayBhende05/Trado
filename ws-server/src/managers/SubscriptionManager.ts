import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {

    private static instance: SubscriptionManager
    private subscriptions: Map<string, string[]> = new Map();  // UserId -> [Field]
    private reverseSubscriptions: Map<string, string[]> = new Map();  // Field -> [UserId]
    private redisClient: RedisClientType


    constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager()
        }
        return this.instance
    }



    public Subscribe(userId: string, field: string) {
        if (this.subscriptions.get(userId)?.includes(field)) {
            return;
        }

        const newSubscription = (this.subscriptions.get(userId) || []).concat((field))
        this.subscriptions.set(userId, newSubscription);

        console.log("The subscription are", this.subscriptions)

        const newReverseSubscription = (this.reverseSubscriptions.get(field) || []).concat(userId)
        this.reverseSubscriptions.set(field, newReverseSubscription);

        console.log("The reverse subscription are", this.reverseSubscriptions)


        if (this.reverseSubscriptions.get(field)?.length === 1) {
            this.redisClient.subscribe(field, this.redisCallbackHandler)
        }

    }

    private redisCallbackHandler = (message: string, field: string) => {
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(field)?.forEach(s => UserManager.getInstance().getUser(s)?.emit(parsedMessage));
    }


    public Unsubscribe(userId: string, field: string) {
        const subscriptions = this.subscriptions.get(userId);
        if (!subscriptions) {
            return;
        }
        const newSubscriptions = subscriptions.filter(s => s !== field);
        this.subscriptions.set(userId, newSubscriptions);


        const reverseSubscriptions = this.reverseSubscriptions.get(field);
        if (!reverseSubscriptions) { return }
        const newReverseSubscription = reverseSubscriptions.filter(id => id !== userId);
        this.reverseSubscriptions.set(field, newReverseSubscription);


        if (newReverseSubscription.length === 0) {
            this.redisClient.unsubscribe(field)
            this.reverseSubscriptions.delete(field)
        }

    }








    public userLeft(userId: string) {
        console.log("user left " + userId);
        this.subscriptions.get(userId)?.forEach(field => this.Unsubscribe(userId, field));
    }






}