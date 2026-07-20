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
    <div
      className=" w-full border-b border-[#1F2937] bg-[#070B12]
  "
    >
      <div
        className=" flex items-center gap-8 overflow-x-auto px-6 py-3
    "
      >
        {/* Market Pair */}
        <Ticker market={market} />

        {/* Current Price */}
        <div className="flex min-w-[120px] flex-col">
          <p className=" text-2xl font-bold tabular-nums  text-white">
            ${Number(ticker?.lastPrice).toLocaleString()}
          </p>

          <p className="text-xs text-gray-500">Last Price</p>
        </div>

        {/* 24h Change */}
        <MarketInfo
          label="24h Change"
          value={`${Number(ticker?.priceChange) > 0 ? "+" : ""}${
            ticker?.priceChange
          } (${Number(ticker?.priceChangePercent).toFixed(2)}%)`}
          green={Number(ticker?.priceChange) >= 0}
        />

        {/* High */}
        <MarketInfo label="24h High" value={`$${ticker?.highPrice ?? "--"}`} />

        {/* Low */}
        <MarketInfo label="24h Low" value={`$${ticker?.lowPrice ?? "--"}`} />

        {/* Volume */}
        <MarketInfo label="24h Volume" value={ticker?.volume ?? "--"} />
      </div>
    </div>
  );
};

function MarketInfo({
  label,
  value,
  green,
}: {
  label: string;
  value: string | number;
  green?: boolean;
}) {
  return (
    <div className=" flex min-w-[110px] flex-col"
    >
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className={`mt-1text-smfont-semiboldtabular-nums${  green === undefined    ? "text-white"    : green    ? "text-[#00D084]"    : "text-[#F6465D]"}`}
      >
        {value}
      </p>
    </div>
  );
}
function Ticker({ market }: { market: string }) {
  const [base, quote] = market.split("U");
  // console.log("THe base is" , base)

  return (
    <div
      className="
      flex
      min-w-[160px]
      items-center
      gap-3
    "
    >
      {/* Coin Icons */}
      <div className="flex items-center">
        <img
          src={`/coins/${base?.toLowerCase()}.png`}
          alt={base}
          className="
            h-9
            w-9
            rounded-full
            border
            border-[#1F2937]
          "
          // onError={(e) => {
          //   e.currentTarget.src = "/sol.webp";
          // }}
        />

        <img
          // src={`/coins/${quote?.toLowerCase()}.png`}
          src={`/coins/usdtc.png`}
          alt={quote}
          className="
            -ml-3
            h-9
            w-9
            rounded-full
            border
            border-[#070B12]
          "
          // onError={(e) => {
          //   e.currentTarget.src = "/usdc.webp";
          // }}
        />
      </div>

      {/* Market Info */}
      <div>
        <h2
          className="
          text-lg
          font-bold
          text-white
        "
        >
          {base} / USDT
        </h2>

        <p className="text-xs text-gray-500">Spot Market</p>
      </div>
    </div>
  );
}
