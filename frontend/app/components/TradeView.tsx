"use client";

import { useEffect, useRef, useState } from "react";

import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/clients";
import { BKline } from "../utils/types";


export function TradeView({
  market,
}: {
  market: string;
}) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;


      try {
        setLoading(true);


        const now = Math.floor(Date.now() / 1000);

        const weekAgo = now - 60 * 60 * 24 * 7;


        const klineData: BKline[] = await getKlines(
          market,
          "1h",
          weekAgo,
          now
        );


        const formattedData = klineData
          .map((item) => ({
            open: Number(item[1]),
            high: Number(item[2]),
            low: Number(item[3]),
            close: Number(item[4]),
            timestamp: item[0],
          }))
          .sort(
            (a, b) => a.timestamp - b.timestamp
          );


        // Remove old chart instance
        chartManagerRef.current?.destroy();


        const chartManager = new ChartManager(
          chartRef.current,
          formattedData,
          {
            background: "#0D1117",
            color: "#FFFFFF",
          }
        );


        chartManagerRef.current = chartManager;


      } catch (error) {
        console.error(
          "Failed loading chart:",
          error
        );

      } finally {
        setLoading(false);
      }
    };


    initChart();


    return () => {
      chartManagerRef.current?.destroy();
      chartManagerRef.current = null;
    };

  }, [market]);


  return (
    <div className="
      relative
      h-[520px]
      w-full
      overflow-hidden
      rounded-xl
      border
      border-[#1F2937]
      bg-[#0D1117]
    ">


      {loading && (
        <div className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          bg-[#0D1117]/80
          text-sm
          text-gray-400
          backdrop-blur-sm
        ">
          Loading chart...
        </div>
      )}


      <div
        ref={chartRef}
        className="h-full w-full"
      />

    </div>
  );
}