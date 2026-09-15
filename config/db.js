import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname (ES Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, "../.env") });

// 🔍 Validasi ENV (biar ketahuan kalau ada yang kosong)
const requiredEnv = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_DATABASE"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ENV ${key} belum diisi di .env`);
    process.exit(1); // langsung hentikan server
  }
});

// 🔌 Buat koneksi pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // ⚠️ pastikan number
  database: process.env.DB_DATABASE,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Test koneksi saat server start
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // stop server kalau gagal connect
  }
})();

// OPTIONAL: log query (buat debug)
pool.on("connect", () => {
  console.log("📦 New DB connection established");
});

pool.on("error", (err) => {
  console.error("💥 Unexpected DB error:", err.message);
});

export default pool;