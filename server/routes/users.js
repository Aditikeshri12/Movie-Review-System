import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('watchedMovies.movie', 'title poster');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's reviews
    const reviews = await Review.find({ user: req.params.id, isActive: true })
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 });

    res.json({
      user,
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0,
        moviesWatched: user.watchedMovies.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, bio, favoriteGenres } = req.body;

    // Check if username is taken by another user
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        username: username || req.user.username,
        bio: bio || req.user.bio,
        favoriteGenres: favoriteGenres || req.user.favoriteGenres
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's dashboard data
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchedMovies.movie', 'title poster genre');

    const reviews = await Review.find({ user: req.user.id, isActive: true })
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate genre preferences
    const genreCount = {};
    user.watchedMovies.forEach(watched => {
      watched.movie.genre.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const favoriteGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    res.json({
      stats: {
        totalReviews: reviews.length,
        moviesWatched: user.watchedMovies.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0,
        favoriteGenres
      },
      recentReviews: reviews.slice(0, 5),
      recentlyWatched: user.watchedMovies
        .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
        .slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;