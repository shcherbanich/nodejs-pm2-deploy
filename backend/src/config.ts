export const { JWT_SECRET = 'JWT_SECRET' } = process.env;

// === New: Postgres config (as per requirements) ===
export const { POSTGRES_HOST = 'localhost' } = process.env;
export const { POSTGRES_DB = 'mesto' } = process.env;
export const { POSTGRES_USER = 'postgres' } = process.env;
export const { POSTGRES_PASSWORD = '' } = process.env;
export const { POSTGRES_PGDATA = '/var/lib/postgresql/data' } = process.env;

// CORS
export const { CORS_ORIGIN = '' } = process.env;

// === Legacy (will be removed after migrating away from Mongo) ===
export const { DB_ADDRESS = 'mongodb://localhost:27017/mestodb' } = process.env;
