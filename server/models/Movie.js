import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String
  }],
  genre: [{
    type: String,
    required: true
  }],
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    default: ''
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  boxOffice: {
    type: Number,
    default: 0
  },
  movieLanguage: {
    type: String
  },
  country: {
    type: String
  },
  awards: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

movieSchema.index({ title: 'text', description: 'text', director: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ 'rating.average': -1 });

export default mongoose.model('Movie', movieSchema);