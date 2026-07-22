import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

import { RedisManger } from "../src/RedisManger.js";



const sendAndAwaitMock = vi.fn();

const getInstanceMock = vi.fn(() => ({
    sendAndAwait: sendAndAwaitMock
}));


vi.mock("../RedisManger.js", () => ({
    RedisManger: {
        getInstance: getInstanceMock
    }
}));


// IMPORTANT: import after vi.mock
const { default: orderRouter } = await import("../src/routes/orderRouter.js");


const app = express();

app.use(express.json());
app.use("/order", orderRouter);



describe("POST /order", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("should create an order and return redis response", async () => {

        sendAndAwaitMock.mockResolvedValue({
            Done: "Brother"
        });


        const response = await request(app)
            .post("/order")
            .send({
                userId: "01",
                price: 120,
                quantity: 10,
                side: "BUY",
                market: "BTCUSDT"
            });


        expect(response.status).toBe(200);


        expect(response.body).toEqual({
            response: {
                Done: "Brother"
            }
        });


        expect(sendAndAwaitMock)
            .toHaveBeenCalledWith({
                type: "CREATE_ORDER",
                data: {
                    userId: "01",
                    price: 120,
                    quantity: 10,
                    side: "BUY",
                    market: "BTCUSDT"
                }
            });

    });

});