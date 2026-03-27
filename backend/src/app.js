require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const claimRoutes = require("./routes/claims");
const notifRoutes = require("./routes/notifications");
const msgRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api", claimRoutes);
app.use("/api", notifRoutes);
app.use("/api", msgRoutes);
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));