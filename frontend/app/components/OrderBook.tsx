import React from "react";
import { AskTable } from "./depth/AskTable";
import { BidTable } from "./depth/BidTable";

function OrderBook({ asks, price, bids }) {
  return (
    <>
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </>
  );
}

export default OrderBook;
