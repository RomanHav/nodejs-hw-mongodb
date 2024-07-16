import mongoose from 'mongoose';

import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const name = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${name}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );

    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('Error while setting up mongo connection', err);
    throw err;
  }
};
