"use client";
import { useEffect, useState } from "react";
import { B24hrTicker, BTicker } from "../utils/types";
import { getTicker } from "../utils/clients";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<B24hrTicker | BTicker | null>(null);

  useEffect(() => {
    getTicker(market).then(setTicker);
    const mark = market.replace("_", "").toLowerCase();

    SignalingManager.getInstance().registerCallback(
      "24hrTicker",
      (data: Partial<B24hrTicker>) =>
        setTicker((prev) => ({
          symbol: data.symbol ?? prev?.symbol ?? "",
          priceChange: data.priceChange ?? prev?.priceChange ?? "",
          priceChangePercent:
            data.priceChangePercent ?? prev?.priceChangePercent ?? "",
          lastPrice: data.lastPrice ?? prev?.lastPrice ?? "",
          highPrice: data.highPrice ?? prev?.highPrice ?? "",
          lowPrice: data.lowPrice ?? prev?.lowPrice ?? "",
          volume: data.volume ?? prev?.volume ?? "",
        })),
      `${mark}@ticker`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`${mark}@ticker`],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "24hrTicker",
        `${mark}@ticker`
      );

      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`${mark}@ticker`],
      });
    };
  }, [market]);

  return (
    <div>
      <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <Ticker market={market} />
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums text-greenText text-md text-green-500`}
              >
                ${ticker?.lastPrice}
              </p>
              <p className="font-medium text-sm text-sm tabular-nums">
                ${ticker?.lastPrice}
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`font-medium text-xs text-slate-400 text-sm`}>
                24H Change
              </p>
              <p
                className={` text-sm font-medium tabular-nums leading-5 text-sm text-greenText ${
                  Number(ticker?.priceChange) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {Number(ticker?.priceChange) > 0 ? "+" : ""}{" "}
                {ticker?.priceChange}{" "}
                {Number(ticker?.priceChangePercent)?.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H High
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm ">
                {ticker?.highPrice}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H Low
              </p>
              <p className="text-sm font-medium tabular-nums leading-5 text-sm ">
                {ticker?.lowPrice}
              </p>
            </div>
            <button
              type="button"
              className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
              data-rac=""
            >
              <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400 text-sm">
                  24H Volume
                </p>
                <p className="mt-1 text-sm font-medium tabular-nums leading-5 text-sm ">
                  {ticker?.volume}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Ticker({ market }: { market: string }) {
  return (
    <div className="flex h-[60px] shrink-0 space-x-4">
      <div className="flex flex-row relative ml-2 -mr-4">
        <img
          alt="SOL Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
          src="/sol.webp"
        />
        <img
          alt="USDC Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="h-6 w-6 -ml-2 mt-4 rounded-full"
          src="/usdc.webp"
        />
      </div>
      <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2 undefined">
            <div className="flex flex-row relative">
              <p className="font-medium text-sm undefined">
                {market.replace("_", " / ")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
