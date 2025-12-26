import { Pool } from "pg";

export async function query(query: string) {
  const pool = new Pool();

  console.log(pool);

  const res = await pool.query(query);

  return res;
}
