export default function TradesBook({ trades }) {
  return (
    <>
      {trades.map((data) => (
        <div
          key={data.id}
          style={{
            display: "flex",
            position: "relative",
            width: "100%",
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              background: data.isBuyerMaker
                ? "rgba(228, 75, 68, 0.325)"   // red (sell)
                : "rgba(34, 197, 94, 0.25)",   // green (buy)
              transition: "width 0.3s ease-in-out",
            }}
          ></div>

          <div className="flex justify-between text-xs w-full">
            <div
              style={{
                color: data.isBuyerMaker ? "red" : "green",
              }}
            >
              {parseFloat(data.price)}
            </div>

            <div>{parseFloat(data.qty)}</div>

            <div>
              {`${String(new Date(data.time).getHours()).padStart(2,"0")}:${String(new Date(data.time).getMinutes()).padStart(2,"0")}:${String(new Date(data.time).getSeconds()).padStart(2,"0")}`}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}