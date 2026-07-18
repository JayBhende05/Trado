"use client";

import { usePathname, useRouter } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button";

export const Appbar = () => {
    const route = usePathname();
    const router = useRouter();

    const navItems = [
        {
            name: "Markets",
            path: "/markets"
        },
        {
            name: "Trade",
            path: "/trade/SOLUSDC"
        }
    ];

    return (
        <header className="
            sticky top-0 z-50
            w-full
            border-b border-[#1F2937]
            bg-[#070B12]/90
            backdrop-blur-xl
        ">
            <div className="
                h-16
                px-6
                flex
                items-center
                justify-between
            ">

                {/* Logo Section */}
                <div className="flex items-center gap-10">

                    <div
                        onClick={() => router.push("/")}
                        className="
                            cursor-pointer
                            text-2xl
                            font-bold
                            tracking-wide
                            text-white
                        "
                    >
                        TR<span className="text-[#00D084]">A</span>DO
                    </div>


                    {/* Navigation */}
                    <nav className="flex items-center gap-2">

                        {navItems.map((item) => {
                            const active = route.startsWith(item.path.split("/")[1]);

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => router.push(item.path)}
                                    className={`
                                        relative
                                        px-4
                                        py-2
                                        text-sm
                                        transition-all
                                        rounded-lg

                                        ${
                                            active
                                            ?
                                            "text-white bg-[#111827]"
                                            :
                                            "text-gray-400 hover:text-white hover:bg-[#111827]"
                                        }
                                    `}
                                >

                                    {item.name}

                                    {active && (
                                        <span
                                            className="
                                                absolute
                                                bottom-0
                                                left-1/2
                                                -translate-x-1/2
                                                w-6
                                                h-[2px]
                                                bg-[#00D084]
                                                rounded-full
                                            "
                                        />
                                    )}

                                </button>
                            )
                        })}

                    </nav>

                </div>



                {/* Actions */}
                <div className="flex items-center gap-3">

                    <button
                        className="
                            px-4
                            py-2
                            rounded-lg
                            text-sm
                            text-gray-300
                            border
                            border-[#1F2937]
                            hover:border-gray-500
                            transition
                        "
                    >
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