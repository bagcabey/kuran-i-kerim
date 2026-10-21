import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const q = <T = any>(text: string, params?: any[]) => pool.query<T>(text, params);
