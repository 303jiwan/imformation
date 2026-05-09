// Codenergy backend entry point.
// Express app on port 3000 (override with PORT env var).
// CORS is locked to the Vite dev origins with credentials enabled so the
// frontend's `fetch(..., { credentials: "include" })` calls succeed.

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRouter, loadSession } from "./auth.js";
import { testRouter } from "./test.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / curl (no Origin header) and whitelisted dev origins.
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`Origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(loadSession);

// Health/landing
app.get("/", (_req, res) => {
  res.json({ name: "codenergy-backend", status: "ok" });
});

// Mount feature routers
app.use("/api", authRouter);
app.use("/api/test", testRouter);

// 404 (JSON)
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
});

// Error handler (JSON)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "internal server error" });
});

app.listen(PORT, () => {
  console.log(`Codenergy backend running at http://localhost:${PORT}`);
});
