import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");

import main from "./main";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true, 
  methods: 'GET, POST',
}));


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the alloan.ai");
});

app.use("/api", main);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});