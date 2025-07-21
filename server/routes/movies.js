import express from 'express';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      genre, 
      sortBy = 'releaseDate', 
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };
    
    // Search functionality (substring, case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Genre filtering
    if (genre && genre !== 'all') {
      query.genre = { $in: [genre] };
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions['rating.average'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'releaseDate') {
      sortOptions.releaseDate = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'title') {
      sortOptions.title = sortOrder === 'desc' ? -1 : 1;
    }

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get reviews for this movie
    const reviews = await Review.find({ movie: req.params.id, isActive: true })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      movie,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create movie (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update movie (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete movie (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular movies
router.get('/popular/trending', async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(10);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;