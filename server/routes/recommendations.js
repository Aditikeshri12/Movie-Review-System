import express from 'express';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/for-you', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchedMovies.movie', 'genre');

    const userReviews = await Review.find({ user: req.user.id })
      .populate('movie', 'genre');

    let recommendedMovies = [];
    let basedOn = [];
    
    const watchedMovieIds = user.watchedMovies.map(watched => watched.movie._id);

    if (userReviews.length > 0) {
      const genrePreferences = {};
      
      userReviews.forEach(review => {
        if (review.movie && review.movie.genre) {
          review.movie.genre.forEach(genre => {
            if (!genrePreferences[genre]) {
              genrePreferences[genre] = { total: 0, count: 0 };
            }
            genrePreferences[genre].total += review.rating;
            genrePreferences[genre].count++;
          });
        }
      });

      const genreRatings = Object.entries(genrePreferences)
        .map(([genre, data]) => ({
          genre,
          avgRating: data.total / data.count
        }))
        .sort((a, b) => b.avgRating - a.avgRating);

      basedOn = genreRatings.slice(0, 3);
      const preferredGenres = basedOn.map(g => g.genre);
      
      if (preferredGenres.length > 0) {
        recommendedMovies = await Movie.find({
          _id: { $nin: watchedMovieIds },
          genre: { $in: preferredGenres },
          isActive: true,
          'rating.average': { $gte: 3.5 }
        })
        .sort({ 'rating.average': -1, 'rating.count': -1 })
        .limit(10);
      }
    }

    if (recommendedMovies.length < 10) {
      const popularMovies = await Movie.find({
        _id: { 
          $nin: [...watchedMovieIds, ...recommendedMovies.map(m => m._id)] 
        },
        isActive: true
      })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(10 - recommendedMovies.length);

      recommendedMovies = [...recommendedMovies, ...popularMovies];
    }

    res.json({
      recommendations: recommendedMovies,
      basedOn: basedOn
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/similar/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const similarMovies = await Movie.find({
      _id: { $ne: movie._id },
      genre: { $in: movie.genre },
      isActive: true
    })
    .sort({ 'rating.average': -1 })
    .limit(8);

    res.json(similarMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = await Review.find({
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    const movieReviewCounts = {};
    recentReviews.forEach(review => {
      const movieId = review.movie.toString();
      movieReviewCounts[movieId] = (movieReviewCounts[movieId] || 0) + 1;
    });

    const trendingMovieIds = Object.entries(movieReviewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([movieId]) => movieId);

    const trendingMovies = await Movie.find({
      _id: { $in: trendingMovieIds },
      isActive: true
    });

    const sortedTrendingMovies = trendingMovieIds.map(id => 
      trendingMovies.find(movie => movie._id.toString() === id)
    ).filter(Boolean);

    res.json(sortedTrendingMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;