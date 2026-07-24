import { Client } from "pg";

const pgClient = new Client({
    user: "postgres",
    host: "localhost",
    database: "my_local_db",
    password: "postgres",
    port: 5432,
});

async function initializeDB() {
    await pgClient.connect();

    await pgClient.query(`
        DROP TABLE IF EXISTS trades;
        DROP TABLE IF EXISTS prices;

        CREATE TABLE trades (
            time TIMESTAMPTZ NOT NULL,
            trade_id BIGINT NOT NULL,
            market VARCHAR(20) NOT NULL,
            side VARCHAR(4) NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            quantity DOUBLE PRECISION NOT NULL,
            quote_quantity DOUBLE PRECISION NOT NULL,
            is_buyer_maker BOOLEAN NOT NULL
        );

        SELECT create_hypertable('trades', 'time');

        CREATE TABLE prices (
            time TIMESTAMPTZ NOT NULL,
            market VARCHAR(20) NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            volume DOUBLE PRECISION NOT NULL,
            currency_code VARCHAR(10) NOT NULL
        );

        SELECT create_hypertable('prices', 'time');
    `);

    await pgClient.end();
    console.log("Database initialized successfully");
}

initializeDB().catch(console.error);