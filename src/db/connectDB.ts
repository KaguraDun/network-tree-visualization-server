import pg from 'pg';

const enum Mode {
  development = 'development',
  production = 'production',
}

const pgConnect = {
  development: {
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    host: 'localhost',
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
};

const db = new pg.Pool(pgConnect[Mode.production]);

export default db;
