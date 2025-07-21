import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { toast } from '../components/ui/Toaster';
import { Calendar, Clock, Star, Play, Users, Edit } from 'lucide-react';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    content: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMovieDetails();
    fetchSimilarMovies();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(response.data.movie);
      setReviews(response.data.reviews);
      
      // Find user's review if logged in
      if (user) {
        const userReviewData = response.data.reviews.find(
          review => review.user._id === user.id
        );
        setUserReview(userReviewData);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/similar/${id}`);
      setSimilarMovies(response.data);
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reviews`, {
        movieId: id,
        ...reviewForm
      });

      setReviews([response.data, ...reviews]);
      setUserReview(response.data);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', content: '' });
      toast.success('Review submitted successfully!');

      // Refresh movie data to update ratings
      fetchMovieDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews(reviews.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
    setUserReview(updatedReview);
    toast.success('Review updated successfully!');
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(reviews.filter(review => review._id !== reviewId));
    setUserReview(null);
    toast.success('Review deleted successfully!');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
          <Link to="/movies" className="text-accent-400 hover:text-accent-300">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-warning-400 fill-current" />
                  <span className="text-white font-semibold text-lg">
                    {movie.rating.average.toFixed(1)}
                  </span>
                  <span className="text-gray-300">
                    ({movie.rating.count} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(movie.releaseDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent-600 text-white rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {movie.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Language</h3>
                  <p className="text-gray-300">{movie.movieLanguage}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary-700 text-gray-300 rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {movie.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Trailer</span>
                  </a>
                )}
                
                {user && !userReview && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center space-x-2 bg-warning-600 text-white px-6 py-3 rounded-lg hover:bg-warning-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-12">
            <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
              <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-accent-600 text-white px-6 py-2 rounded-md hover:bg-accent-700 transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Users className="w-8 h-8 text-accent-400 mr-3" />
              Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onReviewUpdate={handleReviewUpdate}
                  onReviewDelete={handleReviewDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Similar Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarMovies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;