import { createClient } from "redis"
import { Engine } from "./trade/Engine";



async function main() {
    const engine = new Engine()
    const RedisClient = createClient();
    await RedisClient.connect()
    console.log("Connected to Redis Client")


    while (true) {
        const response = await RedisClient.brPop('message', 2)
        if (!response) {

        } else {
            const { clientId, data } = JSON.parse(response.element);
            console.log("Engine consumed message")
            engine.process({ clientId, message: data });
        }
    }



}

main()