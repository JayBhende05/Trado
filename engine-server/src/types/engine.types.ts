import { Order } from "./orderbook.types";

export type proccessMessage = {
    clientId: string,
    message: {
        type: "CREATE_ORDER",
        data: {
            userId: string,
            price: number,
            quantity: number,
            side: "BUY" | "SELL",
            market: string
        }
    }
}
    |
{
    clientId: string,
    message: {
        type: "GET_DEPTH",
        data: {
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

export type SendMessageToAPI = {
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
    |
{
    type: string;
    payload: {
        bids: [],
        asks: []
    }
}
    |
{
    type: string;
    payload: {
        bids: [string, string][],
        asks: [string, string][]
    }
}