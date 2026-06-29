import { useEffect, useRef } from "react";
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

 useEffect(() => {
    const init = async () => {
      let klineData: BKline[] = [];
      try {
        klineData = await getKlines(market, "1h", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000)); 
      // console.log("KLINE DATA IS ", klineData)
      
      } catch (e) { }

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        // console.log(klineData)
        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x[4]),
              high: parseFloat(x[2]),
              low: parseFloat(x[3]),
              open: parseFloat(x[1]),
              timestamp: x[0], 
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      }
    };
    init();
  }, [market, chartRef]);




  return (
    <>
      <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    </>
  );
}
