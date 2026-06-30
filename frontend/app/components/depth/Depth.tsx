"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/clients";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { updateOrderBook } from "@/app/utils/updateOrderBook";
import { B24hrTicker, BTrades } from "@/app/utils/types";
import OrderBook from "../OrderBook";
import TradesBook from "../TradesBook";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string | number>();
  const [btnType, setbtnType] = useState('orderbook')
  const [trades , setTrades] = useState<BTrades[]| BTrades>([]);

  useEffect(() => {
    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));

getTrades(market).then((data) => {
  setTrades(data.map(mapWsTradeToBTrade));
});
// setPrice(t[0].price);
    // console.log("Trades Price ", trades[0].price)

    const mark = market.replace("_", "").toLowerCase();

    SignalingManager.getInstance().registerCallback(
      "depthUpdate",
      (data: { Bids: [string, string][]; Asks: [string, string][] }) => {
        setBids((prev) => updateOrderBook(prev, data.Bids, true));
        setAsks((prev) => updateOrderBook(prev, data.Asks, false));
      },
      `${mark}@depth`
    );

    SignalingManager.getInstance().registerCallback(
      "24hrTicker",
      (data: Partial<B24hrTicker>) =>
        setPrice((prev) => data.lastPrice ?? prev ?? ""),
      `${mark}@ticker`
    );

    SignalingManager.getInstance().registerCallback("trade", (data) => {
  const trade = mapWsTradeToBTrade(data);

  setTrades(prev => [trade, ...prev].slice(0, 30));
}, `${mark}@trade`);


    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${mark}@depth`, `${mark}@trade`],
    });

    
    // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));

    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "depthUpdate",
        `${mark}@depth`
      );

      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${mark}@depth`, `${mark}@trade`],
      });
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-3" >
            <OrderBookButton type={btnType} setType={setbtnType} />
            <TradeButton type={btnType} setType={setbtnType} />

        </div>
      <div>
        { btnType === 'orderbook' ?   
        <section>
          <OrderBookTableHeader />
          <OrderBook asks={asks} price={price} bids={bids} />
        </section> 
        :   
        <section>
          <TradeTableHeader />
          <TradesBook trades={trades} />

        </section> }
       
       
      </div>
    </div>
  );
}

function OrderBookTableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
function TradeTableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Qty</div>
      <div className="text-slate-500"></div>
    </div>
  );
}



function OrderBookButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('orderbook')}>
    <div className={`text-sm font-medium py-1 border-b-2 ${type === 'orderbook' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"}`}>
        Book
    </div>
</div>
}

function TradeButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('trade')}>
    <div className={`text-sm font-medium py-1 border-b-2 ${type === 'trade' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"}`}>
        Trades
    </div>
</div>
}


function mapWsTradeToBTrade(ws: any): BTrades {
  return {
    id: ws.t,
    price: ws.p,
    qty: ws.q,
    quoteQty: (Number(ws.p) * Number(ws.q)).toString(),
    time: ws.T,
    isBuyerMaker: ws.m,
    isBestMatch: ws.M
  };
}