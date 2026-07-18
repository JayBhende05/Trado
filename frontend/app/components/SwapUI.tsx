"use client";
import { useState } from "react";

export function SwapUI({ market }: {market: string}) {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');

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
        value="134.38"
        icon="/usdc.webp"
      />


      <InputBox
        label="Quantity"
        value="123"
        icon="/sol.webp"
      />


      <div className="text-right text-xs text-gray-500">
        ≈ 0.00 USDC
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
        className={`h-12 w-full rounded-xl font-semibold transition ${
          activeTab === "buy"
            ? "bg-[#00D084] text-black hover:bg-[#00A86B]"
            : "bg-[#F6465D] text-white hover:bg-red-600"
        }`}
      >
        {activeTab === "buy" ? "Buy SOL" : "Sell SOL"}
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
  icon,
}: {
  label: string;
  value: string;
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
          readOnly
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