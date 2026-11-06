import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.ORIGINS.split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));

app.get("/", (_req, res) => res.send("Server is running"));

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ error: err.message || "Something went wrong."});
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http:localhost:${port}`);
});
