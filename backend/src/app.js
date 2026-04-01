require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const itemRoutes = require("./routes/items");
const claimRoutes = require("./routes/claims");
const notifRoutes = require("./routes/notifications");
const msgRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");

const app = express();
app.set("trust proxy", 1);

// Basic security headers without extra dependencies.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: process.env.JSON_LIMIT || "1mb" }));

// Simple in-memory rate limit per IP for /api routes.
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 300);
const ipHits = new Map();
app.use("/api", (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  ipHits.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ message: "Too many requests, please try again later" });
  }
  return next();
});
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", passwordResetRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", claimRoutes);
app.use("/api", notifRoutes);
app.use("/api", msgRoutes);
app.use("/api", userRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});