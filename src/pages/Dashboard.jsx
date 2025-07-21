import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';
import { Star, Film, TrendingUp, User, Calendar } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, recommendationsResponse] = await Promise.all([
        axios.get(`${API_URL}/users/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get(`${API_URL}/recommendations/for-you`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      setDashboardData(dashboardResponse.data);
      setRecommendations(recommendationsResponse.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error loading dashboard</h1>
        </div>
      </div>
    );
  }

  const { stats, recentReviews, recentlyWatched } = dashboardData;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-accent-600 to-accent-800 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-xl opacity-90">Here's what's happening in your movie world</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-warning-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalReviews}</h3>
            <p className="text-gray-300">Reviews Written</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <Film className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">{stats.moviesWatched}</h3>
            <p className="text-gray-300">Movies Watched</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
            </h3>
            <p className="text-gray-300">Average Rating</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {new Date().getFullYear() - new Date(user.createdAt).getFullYear()}
            </h3>
            <p className="text-gray-300">Years Active</p>
          </div>
        </div>

        {/* Favorite Genres */}
        {stats.favoriteGenres && stats.favoriteGenres.length > 0 && (
          <div className="bg-primary-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Favorite Genres</h2>
            <div className="flex flex-wrap gap-3">
              {stats.favoriteGenres.map((genreData, index) => (
                <div key={index} className="bg-accent-600 text-white px-4 py-2 rounded-full">
                  <span className="font-medium">{genreData.genre}</span>
                  <span className="ml-2 text-sm opacity-75">({genreData.count})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-accent-400 mr-2" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.slice(0, 10).map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reviews */}
          <div className="bg-primary-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-warning-400 mr-2" />
              Recent Reviews
            </h2>
            {recentReviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet. Start reviewing movies!</p>
            ) : (
              <div className="space-y-4">
                {recentReviews.map(review => (
                  <div key={review._id} className="border-b border-primary-700 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={review.movie.poster}
                        alt={review.movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{review.movie.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-warning-400 fill-current' : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{review.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Watched */}
          <div className="bg-primary-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-accent-400 mr-2" />
              Recently Watched
            </h2>
            {recentlyWatched.length === 0 ? (
              <p className="text-gray-400">No movies watched yet. Start exploring!</p>
            ) : (
              <div className="space-y-4">
                {recentlyWatched.map((watched, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={watched.movie.poster}
                      alt={watched.movie.title}
                      className="w-12 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{watched.movie.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < watched.rating ? 'text-warning-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span>{new Date(watched.watchedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;