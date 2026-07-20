"use client";

import { usePathname, useRouter } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button";

export const Appbar = () => {
  const route = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Markets",
      path: "/markets",
    },
    {
      name: "Trade",
      path: "/trade/SOLUSDC",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2937] bg-[#070B12]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-10">

          <div
            onClick={() => router.push("/")}
            className="cursor-pointer text-2xl font-bold tracking-wide text-white"
          >
            TR<span className="text-[#00D084]">A</span>DO
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = route.startsWith(`/${item.path.split("/")[1]}`);

              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`relative rounded-lg px-4 py-2 text-sm transition-all ${
                    active
                      ? "bg-[#111827] text-white"
                      : "text-gray-400 hover:bg-[#111827] hover:text-white"
                  }`}
                >
                  {item.name}

                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#00D084]" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <button className="rounded-lg border border-[#1F2937] px-4 py-2 text-sm text-gray-300 transition hover:border-gray-500">
            Connect Wallet
          </button>

          <SuccessButton>
            Deposit
          </SuccessButton>

          <PrimaryButton>
            Withdraw
          </PrimaryButton>

        </div>

      </div>
    </header>
  );
};