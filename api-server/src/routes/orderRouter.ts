import { Router } from "express";
import { RedisManger } from "../RedisManger.js";

const orderRouter = Router();


orderRouter.get("/g", (req, res) => {
    const { userId } = req.query;

    RedisManger.getInstance().Subscriber(userId as string);

    res.json({
        message: "Subscribed"
    });
});
orderRouter.post("/", async (req, res) => {

    const { userId, price, quantity, side, market } = req.body;



    RedisManger.getInstance().Publisher(userId, JSON.stringify(req.body));


    res.json({
        message: "Working"
    })
})


export default orderRouter