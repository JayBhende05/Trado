import { Order } from "./orderbook.types";

export interface proccessMessage {
    clientId: string,
    message: {
        type: string,
        data: {
            userId: string,
            price: number,
            quantity: number,
            side: "BUY" | "SELL",
            market: string
        }
    }
}

export interface UserBalance {
    [key: string]: {
        available: number;
        locked: number;
    }
}

export interface SendMessageToAPI {
    type: string;
    status: "SUCCESS" | "FAILED";
    payload: {
        orderId: string;
        executedQty: number;
        fills: {
            price: string;
            qty: number;
            tradeId: number;
        }[];
    }
}

