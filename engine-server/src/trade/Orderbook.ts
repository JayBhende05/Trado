

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

            const remainingAskQty = ask.quantity - ask.filled;
            if (ask.price <= order.price && executedQty < order.quantity && remainingAskQty > 0) {
                const filledQty = Math.min(order.quantity - executedQty, remainingAskQty);
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
            }

            const remainingBidQty = bid.quantity - bid.filled;
            if (bid.price >= order.price && executedQty < order.quantity && remainingBidQty > 0) {
                const amountRemaining = Math.min(order.quantity - executedQty, remainingBidQty);
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

    getDepth() {
        const bids: [string, string][] = [];
        const asks: [string, string][] = [];

        const bidsObj: { [key: string]: number } = {};
        const asksObj: { [key: string]: number } = {};

        for (let i = 0; i < this.bids.length; i++) {
            const order = this.bids[i];
            if (!order) {
                throw new Error("Invalid bid");
            }
            if (!bidsObj[order.price]) {
                bidsObj[order.price] = 0;
            }
            // @ts-ignore 
            bidsObj[order.price] += (order.quantity - order.filled);
        }

        for (let i = 0; i < this.asks.length; i++) {
            const order = this.asks[i];
            if (!order) {
                throw new Error("Invalid ask");
            }
            if (!asksObj[order.price]) {
                asksObj[order.price] = 0;
            }
            // @ts-ignore 

            asksObj[order.price] += (order.quantity - order.filled);
        }

        for (const price in bidsObj) {
            // @ts-ignore 

            bids.push([price, bidsObj[price].toString()]);
        }

        for (const price in asksObj) {
            // @ts-ignore 

            asks.push([price, asksObj[price].toString()]);
        }

        return {
            bids,
            asks
        };
    }




}


