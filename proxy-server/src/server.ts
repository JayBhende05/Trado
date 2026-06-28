import express, { Request, Response } from "express";
import cors from 'cors'


const app = express();

const targetUrl = 'https://api.binance.com'
const port = 3001;

app.use(cors());


app.get("/ticker", async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price");

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


app.get("/depth", async (req: Request, res: Response) => {
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
app.get('/health', (req: Request ,res: Response) => {

	res.status(200).json({
		message : "Server is Running"
	})
});


app.listen( port , ()=>{
	console.log(`Proxy Server is live on http://localhost:${port}`);
}
);


