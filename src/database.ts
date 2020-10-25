const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/'

mongoose.Promise = global.Promise;
mongoose.connection
  .on('error', error => console.log(`MongoDB connection: ${error}`))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => console.log(`MongoDB connection opened!`));

export const connectDatabase = () => {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
