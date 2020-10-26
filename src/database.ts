import { ConnectionOptions } from "mongoose";

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/'

export const connectDatabase = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      .on('error', (error: any) => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => {
        console.log('MongoDB connection open!')
        resolve(mongoose.connections[0])
      });

    mongoose.connect(MONGO_URI, {
      user: 'admin',
      pass: 'example',
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    } as ConnectionOptions);
  })
};
