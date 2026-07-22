
export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "BUY" | "SELL";
    userId: string;
}

export interface Fill {
    price: string;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}