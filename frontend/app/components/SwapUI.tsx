import { useState } from "react";
import axios from "axios";

export function SwapUI({ market }: {market: string}) {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');
    const [price, setPrice] = useState('120');
    const [quantity, setQuantity] = useState('10');
    const [status, setStatus] = useState<string | null>(null);

    const handleOrderSubmit = async () => {
        setStatus("Submitting...");
        const wsMarket = market.includes("_")
            ? market
            : market.replace("USDT", "_USDT").replace("USDC", "_USDC");

        const side = activeTab.toUpperCase();
        const userId = side === "BUY" ? "1" : "2";

        try {
            const response = await axios.post("http://localhost:3001/api/v1/order", {
                userId,
                price: Number(price),
                quantity: Number(quantity),
                side,
                market: wsMarket
            });
            console.log("Order response:", response.data);
            setStatus(`Success: Order Placed!`);
            setTimeout(() => setStatus(null), 3000);
        } catch (error: any) {
            console.error("Order submission failed:", error);
            const errMsg = error.response?.data?.error?.message || error.message || "Failed to place order";
            setStatus(`Error: ${errMsg}`);
            setTimeout(() => setStatus(null), 5000);
        }
    };

   return (
  <div className="overflow-hidden rounded-xl border border-[#1F2937] bg-[#0D1117]">

    {/* Buy / Sell Tabs */}
    <div className="grid grid-cols-2 border-b border-[#1F2937]">
      <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
      <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>


    <div className="space-y-5 p-4">

      {/* Order Type */}
      <div className="flex gap-5 border-b border-[#1F2937]">
        <LimitButton type={type} setType={setType} />
        <MarketButton type={type} setType={setType} />
      </div>


      {/* Balance */}
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          Available Balance
        </span>

        <span className="font-medium text-white">
          36.94 USDC
        </span>
      </div>


      <InputBox
        label="Price"
        value={price}
        onChange={setPrice}
        icon="/usdc.webp"
      />


      <InputBox
        label="Quantity"
        value={quantity}
        onChange={setQuantity}
        icon="/sol.webp"
      />


      {status && (
        <div className={`text-xs text-center font-medium ${status.startsWith("Success") ? "text-green-400" : status.startsWith("Error") ? "text-red-400" : "text-yellow-400"}`}>
          {status}
        </div>
      )}


      <div className="text-right text-xs text-gray-500">
        ≈ {(Number(price || 0) * Number(quantity || 0)).toFixed(2)} USDC
      </div>


      {/* Percentage Buttons */}
      <div className="flex justify-between gap-2">
        {["25%", "50%", "75%", "Max"].map((item) => (
          <button
            key={item}
            className="flex-1 rounded-lg border border-[#1F2937] bg-[#111827] py-2 text-xs text-gray-400 transition hover:border-[#00D084] hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>


      {/* Submit */}
      <button
        onClick={handleOrderSubmit}
        className={`h-12 w-full rounded-xl font-semibold transition ${
          activeTab === "buy"
            ? "bg-[#00D084] text-black hover:bg-[#00A86B]"
            : "bg-[#F6465D] text-white hover:bg-red-600"
        }`}
      >
        {activeTab === "buy" ? "Buy" : "Sell"} {market.replace("_", "").replace("USDT", "").replace("USDC", "")}
      </button>


      {/* Options */}
      <div className="flex gap-5 text-xs text-gray-400">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-[#00D084]"
          />
          Post Only
        </label>


        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-[#00D084]"
          />
          IOC
        </label>

      </div>

    </div>

  </div>
);
}


function InputBox({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: string;
}) {
  return (
    <div>

      <p className="mb-2 text-xs text-gray-500">
        {label}
      </p>


      <div className="relative">

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-[#1F2937] bg-[#070B12] px-4 pr-14 text-right text-xl text-white outline-none focus:border-[#00D084]"
        />


        <img
          src={icon}
          alt={label}
          className="absolute right-4 top-3 h-6 w-6"
        />

      </div>

    </div>
  );
}

function LimitButton({
  type,
  setType,
}: {
  type: string;
  setType: (type: string) => void;
}) {
  return (
    <button
      onClick={() => setType("limit")}
      className={`
        py-3
        text-sm
        ${
          type === "limit"
            ? "border-b-2 border-[#00D084] text-white"
            : "text-gray-500"
        }
      `}
    >
      Limit
    </button>
  );
}

function MarketButton({
  type,
  setType,
}: {
  type: string;
  setType: (type: string) => void;
}) {
  return (
    <button
      onClick={() => setType("market")}
      className={`py-3 text-sm ${
        type === "market"
          ? "border-b-2 border-[#00D084] text-white"
          : "text-gray-500"
      }`}
    >
      Market
    </button>
  );
}

function BuyButton({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <button
      onClick={() => setActiveTab("buy")}
      className={`
        py-3
        text-sm
        font-medium
        transition
        ${
          activeTab === "buy"
            ? "border-b-2 border-[#00D084] text-[#00D084]"
            : "text-gray-500 hover:text-white"
        }
      `}
    >
      Buy
    </button>
  );
}

function SellButton({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <button
      onClick={() => setActiveTab("sell")}
      className={`
        py-3
        text-sm
        font-medium
        transition
        ${
          activeTab === "sell"
            ? "border-b-2 border-[#F6465D] text-[#F6465D]"
            : "text-gray-500 hover:text-white"
        }
      `}
    >
      Sell
    </button>
  );
}