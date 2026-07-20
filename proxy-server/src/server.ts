import express, { Request, Response } from "express";
import cors from 'cors'


const app = express();

const port = 3001;

app.use(cors());


app.get("/api/v1/tickers/USDT", async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22,%22BNBUSDT%22,%22XRPUSDT%22,%22ADAUSDT%22,%22DOGEUSDT%22,%22NEARUSDT%22,%22LTCUSDT%22%5D");

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching ticker:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
app.get("/api/v1/tickers", async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching ticker:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/api/v1/ticker", async (req: Request, res: Response) => {
  try {
		  const symbol = req.query.symbol as string;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol required",
      });
    }
    const response = await fetch(`https://api.binance.com/api/v3/ticker?symbol=${symbol}`);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching tickers:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/api/v1/depth", async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol required",
      });
    }

    const response = await fetch(
      `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch symbol depth data", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
app.get("/api/v1/trades", async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol required",
      });
    }

    const response = await fetch(
      `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=30`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch Trades data", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/api/v1/klines", async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;
		const interval = req.query.interval as string;
		const startTime = req.query.startTime as string;
		const endTime = req.query.endTime as string;

    if (!symbol && !interval) {
      return res.status(400).json({
        success: false,
        message: "Fields required",
      });
    }

    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`
    );

    console.log("SERVER DATA IS", response)

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch data from Binance",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch symbol uiKlines data", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});




app.get('/health', (req: Request ,res: Response) => {

	res.status(200).json({
		message : "Server is Running"
	})
});


app.listen( port , ()=>{
	console.log(`Proxy Server is live on http://localhost:${port}`);
}
);


