import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getContactsController } from './controllers/controlAllContacts.js';
import { getContactByIdController } from './controllers/controllContactsByID.js';

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

  server.get('/contacts', getContactsController);

  server.get('/contacts/:contactId', getContactByIdController);

  server.use('*', (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  server.use((err, req, res, next) => {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err.message,
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};
