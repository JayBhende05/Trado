import express from "express";
import cors from "cors";

import orderRouter from './routes/orderRouter.js'
const app = express();

app.use(express.json());
app.use(cors());
console.log("Hello")

app.use('/api/v1/order', orderRouter)


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});