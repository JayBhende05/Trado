
import axios from "axios";
import { B24hrTicker, BTicker, BDepth, BKline, BTrades } from "./types";
import { MarketAsset } from "../components/MarketTable";

const PROXY_URL = 'http://localhost:3001/api/v1'

export async function getTicker(market: string):Promise<BTicker>{
    return {
        symbol: market,
        priceChange: "0.00",
        priceChangePercent: "0.00",
        weightedAvgPrice: "0.00",
        openPrice: "0.00",
        highPrice: "0.00",
        lowPrice: "0.00",
        lastPrice: "0.00",
        volume: "0.00",
        quoteVolume: "0.00",
        openTime: 0,
        closeTime: 0,
        firstId: 0,
        lastId: 0,
        count: 0
    };
}

export async function getTickers():Promise<B24hrTicker>{
    return {
        symbol: "",
        priceChange: "0.00",
        priceChangePercent: "0.00",
        lastPrice: "0.00",
        highPrice: "0.00",
        lowPrice: "0.00",
        volume: "0.00",
    };
}

export async function getUSDTTickers():Promise<MarketAsset[]>{
    return [];
}


export async function getDepth(market: string):Promise<BDepth>{
    const response =  await axios.get(`${PROXY_URL}/depth?symbol=${market}`);
    if(!response.data){
      throw new Error('Orderbook Data Not Found')
    }
    return response.data.data

}

export async function getTrades(market: string):Promise<BTrades[]>{
    return [];
}


export async function getKlines(market:string, interval: string, startTime: number, endTime: number) {
    return [];
}