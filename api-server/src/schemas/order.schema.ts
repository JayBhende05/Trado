import { z } from "zod";

export const orderSchema = z.object({
    userId: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive(),
    side: z.enum(["BUY", "SELL"]),
    market: z.string()
});


export type Order = z.infer<typeof orderSchema>;