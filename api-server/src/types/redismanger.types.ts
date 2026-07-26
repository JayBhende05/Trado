import { Order } from "../schemas/order.schema.js";

export type sendToApiTypes = {
    type: string,
    data: Order
}
    |
{
    type: string,
    data: {
        market: string
    }

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