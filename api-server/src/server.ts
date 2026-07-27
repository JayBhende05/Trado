import express from "express";
import cors from "cors";

import orderRouter from './routes/orderRouter.js';
import { depthRouter } from "./routes/depthRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
console.log("Hello")

app.use('/api/v1/order', orderRouter)
app.use('/api/v1/depth', depthRouter)

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

export default app