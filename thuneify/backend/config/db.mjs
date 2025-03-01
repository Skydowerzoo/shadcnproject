import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'thuneify',
  password: 'Cn14062000',
  port: 5432,
});

export default pool;