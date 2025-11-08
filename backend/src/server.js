import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";

import {
  initDatabase,
  checkConnection,
  getDatabaseStats,
} from "./models/init.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  const isConnected = await checkConnection();
  const stats = await getDatabaseStats();
  res.json({
    status: isConnected ? "ok" : "error",
    db: stats || "unavailable",
  });
});

app.use("/auth", authRoutes);
app.use("/", orderRoutes);

const startServer = async () => {
  try {
    await checkConnection();

    await initDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();

export default app;
