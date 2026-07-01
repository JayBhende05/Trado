"use client"
import { Appbar } from "../components/Appbar";

import React, { useEffect, useState } from "react";
import MarketTable, { MarketAsset } from "../components/MarketTable";
import { getUSDTTickers } from "../utils/clients";
import { B24hrTicker } from "../utils/types";
import { useRouter } from "next/navigation";



export default function MarketsPage() {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
    const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);


        getUSDTTickers().then((d) => {setAssets(d); console.log("Assests are ", assets);})
        // setAssets(filtered);
        
      } catch (err) {
        console.error("Failed to fetch markets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <Appbar/>
    <div>
      {/* Search input */}
      <input
        placeholder="Search assets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      {/* Market Table */}
      <MarketTable
        assets={assets}
        loading={loading}
        searchTerm={search}
        onSelectAsset={(asset) => {
          router.push(`/trade/${asset.symbol}`);
        }}
      />
    </div>
    </>
  );
}
    
    
    
    
    
    
    
    
    
    
    
