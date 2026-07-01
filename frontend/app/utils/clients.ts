
import axios from "axios";
import { B24hrTicker, BTicker, BDepth, BKline, BTrades } from "./types";
import { MarketAsset } from "../components/MarketTable";

const PROXY_URL = 'http://localhost:3001/api/v1'

export async function getTicker(market: string):Promise<BTicker>{
    const response =  await axios.get(`${PROXY_URL}/ticker?symbol=${market}`);
    if(!response.data){
      throw new Error('Ticker Data Not Found')
    }
    return response.data.data
}

export async function getTickers():Promise<B24hrTicker>{
    const response =  await axios.get(`${PROXY_URL}/tickers`);
    if(!response.data){
      throw new Error('Tickers Data Not Found')
    }
    return response.data.data

}
export async function getUSDTTickers():Promise<MarketAsset[]>{
    const response =  await axios.get(`${PROXY_URL}/tickers/USDT`);
    if(!response.data){
      throw new Error('Tickers Data Not Found')
    }
    return response.data.data

}


export async function getDepth(market: string):Promise<BDepth>{
    const response =  await axios.get(`${PROXY_URL}/depth?symbol=${market}`);
    if(!response.data){
      throw new Error('Orderbook Data Not Found')
    }
    return response.data.data

}
export async function getTrades(market: string):Promise<BTrades[]>{
    const response =  await axios.get(`${PROXY_URL}/trades?symbol=${market}`);
    if(!response.data){
      throw new Error(' Trades Data Not Found')
    }
    return response.data.data


}


export async function getKlines(market:string, interval: string, startTime: number, endTime: number) {
   const response =  await axios.get(`${PROXY_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);

  //  console.log("CLIENT KLINE ", response)
    if(!response.data){
      throw new Error('Chart Data Not Found')
    }
    return response.data.data
  
}