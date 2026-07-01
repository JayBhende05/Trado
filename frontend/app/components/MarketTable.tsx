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
    <div className="bg-backpack-card border border-backpack-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-backpack-border flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase text-backpack-text-muted">
          Markets
        </h2>

        <div className="text-[10px] text-backpack-text-muted uppercase tracking-widest">
          Showing {sortedAssets.length} assets
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase text-backpack-text-muted border-b border-backpack-border">
              <th className="p-4 cursor-pointer" onClick={() => handleSort("symbol")}>
                Asset
              </th>

              <th className="p-4 text-right cursor-pointer" onClick={() => handleSort("lastPrice")}>
                Price
              </th>

              <th className="p-4 text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort("priceChangePercent")}>
                24h %
              </th>

              <th className="p-4 text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort("highPrice")}>
                High
              </th>

              <th className="p-4 text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort("lowPrice")}>
                Low
              </th>

              <th className="p-4 text-right cursor-pointer" onClick={() => handleSort("quoteVolume")}>
                Volume
              </th>

              <th className="p-4 text-right hidden lg:table-cell">
                Chart
              </th>
            </tr>
          </thead>
                    <tbody className="divide-y divide-backpack-border/40">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-backpack-text-muted text-sm"
                >
                  Loading markets...
                </td>
              </tr>
            ) : sortedAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-10 text-center text-backpack-text-muted text-sm"
                >
                  No assets found.
                </td>
              </tr>
            ) : (
              sortedAssets.map((asset) => {
                const base = getBaseSymbol(asset.symbol);
                const change = Number(asset.priceChangePercent);
                const positive = change >= 0;

                const price = Number(asset.lastPrice);
                const high = Number(asset.highPrice);
                const low = Number(asset.lowPrice);
                const volume = Number(asset.quoteVolume);

                // Sparkline
                const spark = asset.sparkline || [];
                const min = Math.min(...spark);
                const max = Math.max(...spark);
                const range = max - min || 1;

                const points = spark
                  .map((v, i) => {
                    const x = (i / (spark.length - 1)) * 90 + 5;
                    const y = 20 - ((v - min) / range) * 15;
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-backpack-border/30 cursor-pointer transition"
                  >
                    {/* Asset */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {base}
                        </span>
                        <span className="text-xs text-backpack-text-muted">
                          {asset.symbol}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 text-right font-mono text-white">
                      {formatPrice(price)}
                    </td>

                    {/* 24h Change */}
                    <td className="p-4 text-right hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                          positive
                            ? "text-brand-green bg-brand-green/10"
                            : "text-brand-red bg-brand-red/10"
                        }`}
                      >
                        {/* {positive ? (
                          // <TrendingUp className="w-3 h-3" />
                        ) : (
                          // <TrendingDown className="w-3 h-3" />
                        )} */}
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </td>

                    {/* High */}
                    <td className="p-4 text-right hidden md:table-cell text-backpack-text-muted">
                      {formatPrice(high)}
                    </td>

                    {/* Low */}
                    <td className="p-4 text-right hidden md:table-cell text-backpack-text-muted">
                      {formatPrice(low)}
                    </td>

                    {/* Volume */}
                    <td className="p-4 text-right font-mono text-white">
                      {formatVolume(volume)}
                    </td>

                    {/* Sparkline */}
                    <td className="p-4 hidden lg:table-cell">
                      <div className="w-[100px] h-6 ml-auto">
                        {spark.length > 0 && (
                          <svg
                            viewBox="0 0 100 24"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                          >
                            <polyline
                              fill="none"
                              stroke={positive ? "#0ecb81" : "#f6465d"}
                              strokeWidth="1.5"
                              points={points}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
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