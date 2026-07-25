import WebSocket from "ws";
import { User } from "../User";


export class UserManager {
    private userMap: Map<string, User> = new Map();
    private static instance: UserManager

    constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance
    }

    public addUser(ws: WebSocket) {
        const randomId = this.generateRandomId();
        const user = new User(randomId, ws)
        this.userMap.set(randomId, user);
        this.registerOnClose(ws, randomId)
    }

    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.userMap.delete(id);
        });
    }

    public getUser(id: string) {
        return this.userMap.get(id);
    }

    private generateRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    }

}