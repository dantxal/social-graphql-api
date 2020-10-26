/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { Connection, ConnectionOptions } from 'mongoose';

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const MONGO_USER = process.env.MONGO_USER || 'root';
const MONGO_PASS = process.env.MONGO_PASS || 'root';
const MONGO_AUTH_SRC = process.env.MONGO_AUTH_SRC || 'admin';

export const connectDatabase = (): Promise<Connection> => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      .on('error', (error: Error) => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => {
        console.log('MongoDB connection open!');
        resolve(mongoose.connections[0]);
      });

    mongoose.connect(MONGO_URI, {
      user: MONGO_USER,
      pass: MONGO_PASS,
      authSource: MONGO_AUTH_SRC,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    } as ConnectionOptions);
  });
};
