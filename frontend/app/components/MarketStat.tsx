

export default function MarketStat({
  title,
  value,
  green = false,
}: {
  title: string;
  value: string;
  green?: boolean;
}) {

  return (
    <div className="
      rounded-xl
      border
      border-[#1F2937]
      bg-[#0D1117]
      p-5
    ">

      <p className="text-sm text-gray-500">
        {title}
      </p>


      <h3
        className={`
          mt-2
          text-2xl
          font-bold
          ${green ? "text-[#00D084]" : "text-white"}
        `}
      >
        {value}
      </h3>

    </div>
  );
}