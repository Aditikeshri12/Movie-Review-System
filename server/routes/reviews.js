import express from 'express';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create review
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, rating, title, content } = req.body;

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user.id,
      movie: movieId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this movie' 
      });
    }

    // Create review
    const review = new Review({
      user: req.user.id,
      movie: movieId,
      rating,
      title,
      content
    });

    await review.save();

    // Update movie rating
    await updateMovieRating(movieId);

    // Add to user's watched movies
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        watchedMovies: {
          movie: movieId,
          rating: rating,
          watchedAt: new Date()
        }
      }
    });

    // Populate review with user data
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, title, content } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating;
    review.title = title;
    review.content = content;

    await review.save();

    // Update movie rating
    await updateMovieRating(review.movie);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar');

    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const movieId = review.movie;
    await Review.findByIdAndDelete(req.params.id);

    // Update movie rating
    await updateMovieRating(movieId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike review
router.post('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user.id;

    // Remove from dislikes if present
    review.dislikes = review.dislikes.filter(id => id.toString() !== userId);

    // Toggle like
    const likeIndex = review.likes.findIndex(id => id.toString() === userId);
    if (likeIndex > -1) {
      review.likes.splice(likeIndex, 1);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      userLiked: review.likes.includes(userId),
      userDisliked: review.dislikes.includes(userId)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dislike/Un-dislike review
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user.id;

    // Remove from likes if present
    review.likes = review.likes.filter(id => id.toString() !== userId);

    // Toggle dislike
    const dislikeIndex = review.dislikes.findIndex(id => id.toString() === userId);
    if (dislikeIndex > -1) {
      review.dislikes.splice(dislikeIndex, 1);
    } else {
      review.dislikes.push(userId);
    }

    await review.save();

    res.json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      userLiked: review.likes.includes(userId),
      userDisliked: review.dislikes.includes(userId)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reviews
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      user: req.params.userId, 
      isActive: true 
    })
    .populate('movie', 'title poster')
    .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update movie rating
async function updateMovieRating(movieId) {
  try {
    const reviews = await Review.find({ movie: movieId, isActive: true });
    
    if (reviews.length === 0) {
      await Movie.findByIdAndUpdate(movieId, {
        'rating.average': 0,
        'rating.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Movie.findByIdAndUpdate(movieId, {
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': reviews.length
    });
  } catch (error) {
    console.error('Error updating movie rating:', error);
  }
}

export default router;