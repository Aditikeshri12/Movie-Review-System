import mongoose from 'mongoose';
import { seedMovies } from './seedMovies.js';

const MONGO_URI = 'mongodb://localhost:27017/moviereview';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await seedMovies();
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });