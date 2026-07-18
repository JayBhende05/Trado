import { Appbar } from "./components/Appbar";

export default function Home() {
  const features = [
    {
      title: "Fast Execution",
      desc: "Lightning fast order processing built for active traders.",
    },
    {
      title: "Market Analytics",
      desc: "Powerful insights to track assets and market movements.",
    },
    {
      title: "Secure Trading",
      desc: "Enterprise-grade security with reliable infrastructure.",
    },
  ];

  return (
    <>
      <Appbar />

      <main className="min-h-screen overflow-hidden bg-[#070B12] text-white">
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 lg:py-28">
          
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#0D1117] px-4 py-2 text-sm text-gray-400">
              <span className="h-2 w-2 rounded-full bg-[#00D084]" />
              Modern Trading Experience
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
              Trade Smarter.
              <br />
              <span className="text-[#00D084]">
                Trade With TRADO.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-400">
              A next-generation trading platform designed for fast execution,
              powerful market insights, and a seamless trading experience.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="rounded-xl bg-[#00D084] px-6 py-3 font-semibold text-black transition hover:bg-[#00b874]">
                Start Trading
              </button>

              <button className="rounded-xl border border-[#1F2937] px-6 py-3 text-gray-300 transition hover:bg-[#111827]">
                Explore Markets
              </button>
            </div>
          </div>


          {/* Trading Preview */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#00D084] opacity-20 blur-[120px]" />

            <div className="relative rounded-2xl border border-[#1F2937] bg-[#0D1117] p-6 shadow-2xl">
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    SOL / USDC
                  </p>

                  <h2 className="mt-1 text-3xl font-bold">
                    $182.45
                  </h2>
                </div>

                <span className="rounded-full bg-[#00D084]/10 px-3 py-1 text-sm text-[#00D084]">
                  +4.21%
                </span>
              </div>


              {/* Chart */}
              <div className="mt-8 flex h-44 items-end rounded-xl border border-[#1F2937] bg-gradient-to-t from-[#00D084]/20 to-transparent p-5">
                <div className="h-24 w-full rotate-[-4deg] rounded-full border-b-2 border-[#00D084]" />
              </div>


              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-5">
                {[
                  ["Volume", "$12.4M"],
                  ["Users", "25K+"],
                  ["Assets", "150+"],
                ].map(([title, value]) => (
                  <div key={title}>
                    <p className="text-xs text-gray-500">
                      {title}
                    </p>
                    <p className="font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </section>


        {/* Features */}
        <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-[#1F2937] bg-[#0D1117] p-6 transition hover:border-[#00D084]/50 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

      </main>
    </>
  );
}