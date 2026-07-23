import { Router } from "express";
import { orderSchema } from "../schemas/order.schema.js";
import { RedisManager } from "../RedisManger.js";

const orderRouter = Router();


orderRouter.post("/", async (req, res) => {

    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: result.error
        });
    }
    console.log("Order Receieved");

    const response = await RedisManager.getInstance().sendAndAwait({
        type: "CREATE_ORDER",
        data: result.data
    })


    console.log("Order Response Send")
    res.status(200).json({
        response
    })
})


export default orderRouter