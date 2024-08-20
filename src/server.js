import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import mainRouter from './routers/index.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const server = express();

  server.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  server.use(express.json());
  server.use(cors());
  server.use(cookieParser());
  server.use(mainRouter);

  server.use('*', notFoundHandler);

  server.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};
