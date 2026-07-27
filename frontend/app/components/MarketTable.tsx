/**
 * MarketTable (Binance API version)
 */

import React, { useMemo, useState } from "react";
// import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * Binance API shape (24hr ticker)
 */
export interface MarketAsset {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  quoteVolume: string;
  sparkline?: number[];
}

interface MarketTableProps {
  assets: MarketAsset[];
  loading?: boolean;
  searchTerm: string;
  onSelectAsset: (asset: MarketAsset) => void;
}

type SortField =
  | "symbol"
  | "lastPrice"
  | "priceChangePercent"
  | "highPrice"
  | "lowPrice"
  | "quoteVolume";

export default function MarketTable({
  assets,
  loading = false,
  searchTerm,
  onSelectAsset,
}: MarketTableProps) {
  const [sortField, setSortField] = useState<SortField>("quoteVolume");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ----------------------------
  // Helpers
  // ----------------------------
  const formatPrice = (value: number) => {
    if (value === 0) return "--";
    if (value < 0.0001) return `$${value.toFixed(8)}`;
    if (value < 1) return `$${value.toFixed(5)}`;
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(0)}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // ----------------------------
  // Filter
  // ----------------------------
  const filteredAssets = useMemo(() => {
    return assets.filter((a) =>
      a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  // ----------------------------
  // Sort
  // ----------------------------
  const sortedAssets = useMemo(() => {
    const data = [...filteredAssets];

    data.sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      // numeric conversion
      if (sortField !== "symbol") {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortOrder === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    return data;
  }, [filteredAssets, sortField, sortOrder]);

  const isPositive = (asset: MarketAsset) =>
    Number(asset.priceChangePercent) >= 0;

  const getBaseSymbol = (symbol: string) => symbol.replace("USDT", "");

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#0D1117] shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F2937] p-5">

        <div>
          <h2 className="text-lg font-semibold text-white">
            Markets
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Live crypto prices
          </p>
        </div>

        <div className="rounded-lg border border-[#1F2937] bg-[#070B12] px-3 py-2 text-xs text-gray-400">
          {sortedAssets.length} Assets
        </div>

      </div>


      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-[#1F2937] text-[11px] uppercase tracking-wider text-gray-500">

              <th
                className="cursor-pointer p-4"
                onClick={() => handleSort("symbol")}
              >
                Asset
              </th>

              <th
                className="cursor-pointer p-4 text-right"
                onClick={() => handleSort("lastPrice")}
              >
                Price
              </th>

              <th
                className="hidden cursor-pointer p-4 text-right md:table-cell"
                onClick={() => handleSort("priceChangePercent")}
              >
                24h Change
              </th>

              <th className="hidden p-4 text-right md:table-cell">
                High
              </th>

              <th className="hidden p-4 text-right md:table-cell">
                Low
              </th>

              <th
                className="cursor-pointer p-4 text-right"
                onClick={() => handleSort("quoteVolume")}
              >
                Volume
              </th>

              <th className="hidden p-4 text-right lg:table-cell">
                Trend
              </th>

            </tr>
          </thead>


          <tbody className="divide-y divide-[#1F2937]">

            {loading ? (

              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-gray-500"
                >
                  Loading markets...
                </td>
              </tr>

            ) : sortedAssets.length === 0 ? (

              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-gray-500"
                >
                  No assets found
                </td>
              </tr>

            ) : (

              sortedAssets.map((asset) => {

                const base = getBaseSymbol(asset.symbol);
                const change = Number(asset.priceChangePercent);
                const positive = change >= 0;


                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => onSelectAsset(asset)}
                    className="cursor-pointer transition hover:bg-[#111827]"
                  >

                    {/* Asset */}
                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F2937] bg-[#070B12] text-xs font-bold text-[#00D084]">
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

                          />
                        </div>


                        <div>
                          <p className="font-semibold text-white">
                            {base}
                          </p>

                          <p className="text-xs text-gray-500">
                            {asset.symbol}
                          </p>
                        </div>

                      </div>

                    </td>


                    {/* Price */}
                    <td className="p-4 text-right font-mono text-white">
                      {formatPrice(Number(asset.lastPrice))}
                    </td>


                    {/* Change */}
                    <td className="hidden p-4 text-right md:table-cell">

                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-semibold ${positive
                          ? "bg-[#00D084]/10 text-[#00D084]"
                          : "bg-[#F6465D]/10 text-[#F6465D]"
                          }`}
                      >
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>

                    </td>


                    {/* High */}
                    <td className="hidden p-4 text-right text-gray-400 md:table-cell">
                      {formatPrice(Number(asset.highPrice))}
                    </td>


                    {/* Low */}
                    <td className="hidden p-4 text-right text-gray-400 md:table-cell">
                      {formatPrice(Number(asset.lowPrice))}
                    </td>


                    {/* Volume */}
                    <td className="p-4 text-right font-mono text-white">
                      {formatVolume(Number(asset.quoteVolume))}
                    </td>


                    {/* Chart */}
                    <td className="hidden p-4 lg:table-cell">

                      <div className="ml-auto h-7 w-[100px]">

                        {asset.sparkline?.length ? (

                          <svg
                            viewBox="0 0 100 24"
                            className="h-full w-full"
                          >

                            <polyline
                              fill="none"
                              stroke={positive ? "#00D084" : "#F6465D"}
                              strokeWidth="2"
                              points={asset.sparkline
                                .map((v, i) => {

                                  const x =
                                    (i / (asset.sparkline!.length - 1)) * 90 + 5;

                                  const y =
                                    20 -
                                    (v /
                                      Math.max(
                                        ...asset.sparkline!
                                      )) *
                                    15;

                                  return `${x},${y}`;
                                })
                                .join(" ")}
                            />

                          </svg>

                        ) : null}

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}