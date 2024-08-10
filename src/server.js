import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import contactRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

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
  server.use(contactRouter);

  server.use('*', notFoundHandler);

  server.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};
