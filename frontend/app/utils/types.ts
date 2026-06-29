



export interface B24hrTicker{
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
};


export interface BTicker{
  symbol: string,
  priceChange: string,
  priceChangePercent: string,
  weightedAvgPrice: string,
  openPrice: string,
  highPrice: string,
  lowPrice: string,
  lastPrice: string,
  volume: string,
  quoteVolume: string,
  openTime: number,
  closeTime: number,
  firstId: number,
  lastId: number,
  count: number
}

export interface BDepth {
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: string
}

export type BKline = [
   openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteAssetVolume: string,
  numberOfTrades: number,
  takerBuyBaseAssetVolume: string,
  takerBuyQuoteAssetVolume: string,
  ignore: string
];