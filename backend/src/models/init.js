import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDatabase = async () => {
  try {
    console.log("🔄 Initializing database...");

    const sqlPath = path.join(__dirname, "../../migrations/init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sql);

    console.log("✅ Database initialized successfully");
    console.log("✅ Tables created: users, orders");
    console.log("✅ Seed user created: test@example.com");

    return true;
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    throw error;
  }
};

export const checkConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection OK:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

export const getDatabaseStats = async () => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const ordersCount = await pool.query("SELECT COUNT(*) FROM orders");

    return {
      users: parseInt(usersCount.rows[0].count),
      orders: parseInt(ordersCount.rows[0].count),
    };
  } catch (error) {
    console.error("❌ Error getting database stats:", error.message);
    return null;
  }
};

export default { initDatabase, checkConnection, getDatabaseStats };
