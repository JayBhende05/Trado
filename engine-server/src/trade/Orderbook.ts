

import { Order, Fill } from "../types/orderbook.types"

export class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string;
    lastTradeId: number;
    currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.quoteAsset = "USDT"
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }


    addOrder(order: Order): {
        executedQty: number,
        fills: Fill[]
    } {
        
        if (order.side === "BUY") {
            const { executedQty, fills } = this.matchAsks(order);
            order.filled = executedQty;
            console.log("Fills Created")
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                };
            }
            this.bids.push(order);
            return {
                executedQty,
                fills
            };
        } else {
            const { executedQty, fills } = this.matchBids(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQty,
                fills
            }
        }
    }

    matchAsks(order: Order): { fills: Fill[]; executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;
        console.log("Matching of Asks Started")

        for (let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
            if (!ask) continue;

            if (ask.price <= order.price && executedQty < order.quantity) {
                const filledQty = Math.min(order.quantity - executedQty, ask.quantity);
                executedQty += filledQty;
                ask.filled += filledQty;
                fills.push({
                    price: ask.price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: ask.userId,
                    markerOrderId: ask.orderId
                });
            }
        }

        for (let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
            if (ask && ask.filled === ask.quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }

        return {
            fills,
            executedQty
        };
    }

    matchBids(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;
        console.log("Matching of Bids Started")

        for (let i = 0; i < this.bids.length; i++) {
            const bid = this.bids[i];
            if (!bid) {
                throw new Error("Invalid bid");
            };

            if (bid.price >= order.price && executedQty < order.quantity) {
                const amountRemaining = Math.min(order.quantity - executedQty, bid.quantity);
                executedQty += amountRemaining;
                bid.filled += amountRemaining;
                fills.push({
                    price: bid.price.toString(),
                    qty: amountRemaining,
                    tradeId: this.lastTradeId++,
                    otherUserId: bid.userId,
                    markerOrderId: bid.orderId
                });
            }
        }
        for (let i = 0; i < this.bids.length; i++) {
            const bid = this.bids[i];
            if (!bid) {
                throw new Error("Invalid bid");
            }
            if (bid.filled === bid.quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {
            fills,
            executedQty
        };
    }
}