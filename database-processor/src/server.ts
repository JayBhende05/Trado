import { createClient } from "redis";
import { Client } from "pg";

const pgClient = new Client({
    user: "postgres",
    host: "localhost",
    database: "my_local_db",
    password: "postgres",
    port: 5432,
});

pgClient.connect();

async function main() {
    const redisClient = createClient();
    await redisClient.connect();

    console.log("Connected to Redis");

    while (true) {
        const response = await redisClient.rPop("db_processor");

        if (!response) {
            continue;
        }

        const data = JSON.parse(response);

        if (data.type === "TRADE_ADDED") {
            const { id, market, side, isBuyerMaker, price, quantity, quoteQuantity, timestamp, currency_code, } = data.data;

            const time = new Date(timestamp);


            await pgClient.query(`INSERT INTO trades (time,trade_id,market,side,price,quantity,quote_quantity,is_buyer_maker)VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [time, Number(id), market, side, Number(price), Number(quantity), Number(quoteQuantity), isBuyerMaker]);


            await pgClient.query(`INSERT INTO prices ( time, market, price, volume, currency_code) VALUES ($1,$2,$3,$4, $5)`, [time, market, Number(price), Number(quantity), currency_code,]);

            console.log(`Trade ${id} stored successfully`);
        }
    }
}

main().catch(console.error);