
import axios from "axios";
import { B24hrTicker, BTicker, BDepth, BKline } from "./types";

const PROXY_URL = 'http://localhost:3001/api/v1'

export async function getTicker(market: string):Promise<BTicker>{
    const response =  await axios.get(`${PROXY_URL}/ticker?symbol=${market}`);
    if(!response.data){
      throw new Error('Data not found')
    }
    return response.data.data
}

export async function getTickers():Promise<B24hrTicker>{
    const response =  await axios.get(`${PROXY_URL}/tickers`);
    if(!response.data){
      throw new Error('Data not found')
    }
    return response.data.data

}


export async function getDepth(market: string):Promise<BDepth>{
    const response =  await axios.get(`${PROXY_URL}/depth?symbol=${market}`);
    if(!response.data){
      throw new Error('Data not found')
    }
    return response.data.data

}


export async function getKlines(market:string, interval: string, startTime: number, endTime: number) {
   const response =  await axios.get(`${PROXY_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);

  //  console.log("CLIENT KLINE ", response)
    if(!response.data){
      throw new Error('Data not found')
    }
    return response.data.data
  
}