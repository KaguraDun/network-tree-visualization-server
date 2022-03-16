import pg from 'pg';

const db = new pg.Pool({
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost',
});

export default db;
