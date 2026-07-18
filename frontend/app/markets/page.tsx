"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Appbar } from "../components/Appbar";
import MarketTable, { MarketAsset } from "../components/MarketTable";
import { getUSDTTickers } from "../utils/clients";
import MarketStat from "../components/MarketStat";


export default function MarketsPage() {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const router = useRouter();


  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);

        const data = await getUSDTTickers();

        setAssets(data);

      } catch (error) {
        console.error("Failed to fetch markets", error);

      } finally {
        setLoading(false);
      }
    };


    fetchMarkets();
  }, []);


  return (
    <>
      <Appbar />

      <main className="min-h-screen bg-[#070B12] px-6 py-8">

        <div className="mx-auto max-w-7xl">


          {/* Header */}
          <div className="
            mb-8
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-center
            md:justify-between
          ">

            <div>
              <h1 className="text-3xl font-bold text-white">
                Markets
              </h1>

              <p className="mt-2 text-gray-400">
                Explore live cryptocurrency prices and market movements.
              </p>
            </div>


            {/* Search */}
            <div className="relative w-full md:w-80">

              <span className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-500
              ">
                ⌕
              </span>


              <input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#1F2937]
                  bg-[#0D1117]
                  py-3
                  pl-11
                  pr-4
                  text-white
                  outline-none
                  transition
                  placeholder:text-gray-500
                  focus:border-[#00D084]
                  focus:ring-1
                  focus:ring-[#00D084]/30
                "
              />

            </div>

          </div>



          {/* Stats */}
          <div className="
            mb-8
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-3
          ">

            <MarketStat
              title="Total Assets"
              value={loading ? "..." : assets.length.toString()}
            />

            <MarketStat
              title="Trading Pair"
              value="USDT"
            />

            <MarketStat
              title="Market Status"
              value="Live"
              green
            />

          </div>



          {/* Table */}
          <MarketTable
            assets={assets}
            loading={loading}
            searchTerm={search}
            onSelectAsset={(asset) => {
              router.push(`/trade/${asset.symbol}`);
            }}
          />


        </div>

      </main>
    </>
  );
}

