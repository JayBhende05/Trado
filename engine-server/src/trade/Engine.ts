import { RedisManager } from "../RedisManager";
import { proccessMessage, UserBalance } from "../types/engine.types";
import { Fill, Order } from "../types/orderbook.types";
import { Orderbook } from "./Orderbook";

export const BASE_CURRENCY = "USDT";

export class Engine {
    private orderbooks: Orderbook[] = [];
    private balances: Map<string, UserBalance> = new Map();

    constructor() {
        this.orderbooks = [new Orderbook(`BTC`, [], [], 0, 0)];
        this.setBaseBalances();
        console.log("Initial orderbook is", this.orderbooks)
        console.log("Initial balances are", this.balances)
    }

    public process({ clientId, message }: proccessMessage) {
        switch (message.type) {
            case 'CREATE_ORDER':
                try {
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId);

                    console.log("order placed successfully", {
                        clientId,
                        executedQty,
                        fills,
                        orderId
                    })
                    console.log("Updated balance is", this.balances)
                    console.log("Updated Orderbook is", this.orderbooks)
                    console.log("Response published to Id", clientId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        status: "SUCCESS",
                        payload: {
                            executedQty,
                            fills,
                            orderId
                        },
                    })

                    console.log("--------------END-----------------")

                    break;
                } catch (error) {
                    console.log("Failed to place order", {
                        clientId,
                        error
                    })
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_FAILED",
                        status: "FAILED",
                        payload: {
                            executedQty: 0,
                            fills: [],
                            orderId: ""
                        },
                    })
                }

            case 'GET_DEPTH':
                try {
                    const market = message.data.market;
                    const orderbook = this.orderbooks.find(o => o.ticker() === market);
                    if (!orderbook) {
                        throw new Error("No orderbook found");
                    }
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: orderbook.getDepth()
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: []
                        }
                    });
                }
                break;

        }


    }


    createOrder(market: string, price: number, quantity: number, side: "BUY" | "SELL", userId: string) {

        const orderbook = this.orderbooks.find(o => o.ticker() === market)
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];

        if (!orderbook) {
            throw new Error("No orderbook found");
        }
        if (!baseAsset || !quoteAsset) {
            throw new Error("Missing asset");
        }

        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, price, quantity);

        const order: Order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            filled: 0,
            side,
            userId
        }

        const { fills, executedQty } = orderbook.addOrder(order);
        this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);
        this.createDbTrades(fills, market, side, quoteAsset);
        console.log("Balance of Buyers and Seller Updated");
        this.publisWsDepthUpdates(fills, price, side, market);
        this.publishWsTrades(fills, userId, market);
        // console.log("ExecutedQty", executedQty);
        // console.log("fills", fills);
        // console.log("order", order);
        // console.log("orderbook", this.orderbooks);
        // console.log("balances", this.balances);
        return { executedQty, fills, orderId: order.orderId };
    }

    setBaseBalances() {
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "BTC": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "BTC": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("5", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "BTC": {
                available: 10000000,
                locked: 0
            }
        });
    }

    checkAndLockFunds(baseAsset: string, quoteAsset: string, side: "BUY" | "SELL", userId: string, price: number, quantity: number) {
        console.log("Checked and Locked Funds")
        if (side === "BUY") {
            if ((this.balances.get(userId)?.[quoteAsset]?.available || 0) < (quantity * price)) {
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)?.[quoteAsset].available - (quantity * price);

            //@ts-ignore
            this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked + (quantity * price);
        } else {
            if ((this.balances.get(userId)?.[baseAsset]?.available || 0) < quantity) {
                throw new Error("Insufficient funds");
            }
            //@ts-ignore
            this.balances.get(userId)[baseAsset].available = this.balances.get(userId)?.[baseAsset].available - (quantity);

            //@ts-ignore
            this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)?.[baseAsset].locked + quantity;
        }
    }

    updateBalance(userId: string, baseAsset: string, quoteAsset: string, side: "BUY" | "SELL", fills: Fill[], executedQty: number) {
        if (side === "BUY") {
            fills.forEach(fill => {

                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)?.[quoteAsset].available + (fill.qty * fill.price);

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked - (fill.qty * fill.price);

                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)?.[baseAsset].locked - fill.qty;

                //@ts-ignore
                this.balances.get(userId)[baseAsset].available = this.balances.get(userId)?.[baseAsset].available + fill.qty;

            });

        } else {
            fills.forEach(fill => {
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].locked = this.balances.get(fill.otherUserId)?.[quoteAsset].locked - (fill.qty * fill.price);

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)?.[quoteAsset].available + (fill.qty * fill.price);

                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].available = this.balances.get(fill.otherUserId)?.[baseAsset].available + fill.qty;

                //@ts-ignore
                this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)?.[baseAsset].locked - (fill.qty);

            });
        }
    }


    createDbTrades(fills: Fill[], market: string, side: "BUY" | "SELL", currency_code: string) {
        console.log("Inside create DB Trades")
        fills.forEach(fill => {
            RedisManager.getInstance().sendToQueue({
                type: "TRADE_ADDED",
                data: {
                    market,
                    id: fill.tradeId.toString(),
                    side,
                    isBuyerMaker: side === "SELL",
                    price: fill.price,
                    quantity: fill.qty.toString(),
                    quoteQuantity: (fill.qty * Number(fill.price)).toString(),
                    timestamp: Date.now(),
                    currency_code,
                }
            });
        });
    }


    publishWsTrades(fills: Fill[], userId: string, market: string) {
        fills.forEach(fill => {
            RedisManager.getInstance().publishMessage(`trade@${market}`, {
                stream: `trade@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.otherUserId === userId,
                    p: fill.price,
                    q: fill.qty.toString(),
                    s: market,
                }
            });
        });
    }

    publisWsDepthUpdates(fills: Fill[], price: number, side: "BUY" | "SELL", market: string) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) {
            return;
        }
        const depth = orderbook.getDepth();
        if (side === "BUY") {
            const updatedAsks = depth?.asks.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatedBid = depth?.bids.find(x => x[0] === price.toString());
            console.log("publish ws depth updates")
            RedisManager.getInstance().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatedAsks,
                    b: updatedBid ? [updatedBid] : [],
                    e: "depth"
                }
            });
        }
        if (side === "SELL") {
            const updatedBids = depth?.bids.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatedAsk = depth?.asks.find(x => x[0] === price.toString());
            console.log("publish ws depth updates")
            RedisManager.getInstance().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatedAsk ? [updatedAsk] : [],
                    b: updatedBids,
                    e: "depth"
                }
            });
        }
    }



}