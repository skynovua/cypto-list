import express, { Application, Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5000");
const requestopts = {
  convert: "USD",
  headers: {
    "X-CMC_PRO_API_KEY": "38110896-8c51-436e-8cbe-89898d15fc86",
  },
};

//Init Middleware
app.use(express.json(), cors());

app.get(
  "/cryptocurrency/listings/latest",
  async (req: Request, res: Response) => {
    try {
      const response = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          ...requestopts,
          params: req.query,
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error);
    }
  }
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
