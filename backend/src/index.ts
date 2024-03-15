import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import setupRoutes from "./routes.js";
export { db } from "./database.js";
export { redis } from "./redis.js";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
setupRoutes(app);
app.listen(3000, () => console.log("Server running on port 3000"));

