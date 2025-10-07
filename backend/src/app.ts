import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import cors from 'cors';

import errorHandler from './middlewares/error-handler';
import routes from './routes';
import { initDb } from './db';

const { PORT = 4000 } = process.env;
const app = express();

// CORS
const allowed = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowed.length ? allowed : true, credentials: true }));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(routes);

// Celebrate/Joi errors and our error handler
app.use(errors());
app.use(errorHandler);

// Bootstrap Postgres and start server
(async () => {
  try {
    await initDb(); // reads POSTGRES_* from env and ensures base tables exist
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is up on port ${PORT}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize database:', e);
    process.exit(1);
  }
})();
