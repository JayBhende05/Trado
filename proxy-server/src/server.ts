import express, { Request, Response } from "express";
import {createProxyMiddleware} from 'http-proxy-middleware'
import cors from 'cors'


const app = express();

const targetUrl = 'https://api.binance.com'
const port = 3001;

app.use(cors());

app.use('/', createProxyMiddleware({
	target: targetUrl,
	changeOrigin: true,
	  headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
}));


app.get('/health', (req: Request ,res: Response) => {

	res.status(200).json({
		message : "Server is Running"
	})
});


app.listen( port , ()=>{
	console.log(`Proxy Server is live on http://localhost:${port}`);
}
);


