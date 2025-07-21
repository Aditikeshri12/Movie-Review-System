import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MovieCard from '../components/MovieCard';
import { Star, TrendingUp, Film, Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();
  const [popularMovies, setPopularMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchHomeData();
  }, [user]);

  const fetchHomeData = async () => {
    try {
      // Fetch popular movies
      const popularResponse = await axios.get(`${API_URL}/movies/popular/trending`);
      setPopularMovies(popularResponse.data);

      // Fetch recommendations if user is logged in
      if (user) {
        try {
          const recommendationsResponse = await axios.get(`${API_URL}/recommendations/for-you`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setRecommendations(recommendationsResponse.data.recommendations);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          setRecommendations([]);
        }
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-accent-600 to-accent-800 text-white py-20 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers sharing reviews, ratings, and recommendations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="bg-white text-accent-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Movies
            </Link>
            {!user && (
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent-600 transition-colors"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-primary-800 rounded-lg p-6 text-center">
              <Film className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white mb-1">1,000+</h3>
              <p className="text-gray-300">Movies</p>
            </div>
            <div className="bg-primary-800 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white mb-1">10,000+</h3>
              <p className="text-gray-300">Users</p>
            </div>
            <div className="bg-primary-800 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white mb-1">50,000+</h3>
              <p className="text-gray-300">Reviews</p>
            </div>
            <div className="bg-primary-800 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white mb-1">4.5/5</h3>
              <p className="text-gray-300">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Star className="w-8 h-8 text-accent-400 mr-3" />
                Recommended for You
              </h2>
              <Link
                to="/dashboard"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.slice(0, 5).map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Movies */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <TrendingUp className="w-8 h-8 text-accent-400 mr-3" />
              Popular Movies
            </h2>
            <Link
              to="/movies"
              className="text-accent-400 hover:text-accent-300 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {popularMovies.slice(0, 10).map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-primary-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Movie Journey?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of movie enthusiasts and discover your next favorite film
            </p>
            <Link
              to="/register"
              className="bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;