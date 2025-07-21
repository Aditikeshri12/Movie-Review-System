import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ReviewCard from '../components/ReviewCard';
import { User, Calendar, Star, Film, Award, Edit } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    favoriteGenres: []
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      setProfileData(response.data);
      setEditForm({
        username: response.data.user.username,
        bio: response.data.user.bio || '',
        favoriteGenres: response.data.user.favoriteGenres || []
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/profile`, editForm);
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleGenreToggle = (genre) => {
    setEditForm(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const availableGenres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy',
    'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Biography'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User not found</h1>
        </div>
      </div>
    );
  }

  const { user, reviews, stats } = profileData;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-primary-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-24 h-24 bg-accent-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                <p className="text-gray-300 mb-4">{user.bio || 'No bio available'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-md hover:bg-accent-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-8 border-t border-primary-700 pt-8">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Favorite Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableGenres.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          editForm.favoriteGenres.includes(genre)
                            ? 'bg-accent-600 text-white'
                            : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-accent-600 text-white px-6 py-2 rounded-md hover:bg-accent-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Favorite Genres */}
          {user.favoriteGenres && user.favoriteGenres.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {user.favoriteGenres.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent-600 text-white rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-warning-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalReviews}</h3>
            <p className="text-gray-300">Reviews</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <Film className="w-8 h-8 text-accent-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">{stats.moviesWatched}</h3>
            <p className="text-gray-300">Movies Watched</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
            </h3>
            <p className="text-gray-300">Avg Rating</p>
          </div>
          <div className="bg-primary-800 rounded-lg p-6 text-center">
            <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {new Date().getFullYear() - new Date(user.createdAt).getFullYear()}
            </h3>
            <p className="text-gray-300">Years Active</p>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {isOwnProfile ? 'Your Reviews' : `${user.username}'s Reviews`}
          </h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {isOwnProfile ? 'You haven\'t written any reviews yet.' : 'No reviews yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;