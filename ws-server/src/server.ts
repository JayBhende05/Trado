import { WebSocketServer } from "ws";
import { UserManager } from "./managers/UserManager";

const wss = new WebSocketServer({ port: 3004 });

wss.on("connection", (ws) => {
    console.log("Connection established Successfully")
    
    UserManager.getInstance().addUser(ws)

})