import { Pool } from "pg";

export async function query(query: string, values?: any[]) {
  const pool = new Pool();

  const res = await pool.query(query, values);

  return res;
}
