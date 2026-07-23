import { Order } from "../schemas/order.schema.js";

export interface sendToApiTypes {
    type: string,
    data: Order
}


export interface AwaitedMessageFromEngine {
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