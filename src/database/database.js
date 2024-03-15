import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

export const getConnection = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  return pool.connect();
};

