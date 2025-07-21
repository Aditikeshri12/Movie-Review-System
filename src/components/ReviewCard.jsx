import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, User, Calendar, Edit, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import axios from 'axios';

const ReviewCard = ({ review, onReviewUpdate, onReviewDelete }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(review.likes?.length || 0);
  const [dislikes, setDislikes] = useState(review.dislikes?.length || 0);
  const [userLiked, setUserLiked] = useState(
    user ? review.likes?.includes(user.id) : false
  );
  const [userDisliked, setUserDisliked] = useState(
    user ? review.dislikes?.includes(user.id) : false
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: review.rating,
    title: review.title,
    content: review.content
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post(`${API_URL}/reviews/${review._id}/like`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserLiked(response.data.userLiked);
      setUserDisliked(response.data.userDisliked);
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post(`${API_URL}/reviews/${review._id}/dislike`);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setUserLiked(response.data.userLiked);
      setUserDisliked(response.data.userDisliked);
    } catch (error) {
      console.error('Error disliking review:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/reviews/${review._id}`, editForm);
      onReviewUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${API_URL}/reviews/${review._id}`);
        onReviewDelete(review._id);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <StarRating
              rating={editForm.rating}
              onRatingChange={(rating) => setEditForm({ ...editForm, rating })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review
            </label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-accent-600 text-white px-4 py-2 rounded-md hover:bg-accent-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-primary-800 rounded-lg p-6 border border-primary-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link 
            to={`/profile/${review.user._id}`}
            className="flex items-center space-x-2 hover:text-accent-400 transition-colors"
          >
            <User className="w-8 h-8 text-gray-400" />
            <span className="text-white font-medium">{review.user.username}</span>
          </Link>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
        
        {user && user.id === review.user._id && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <StarRating rating={review.rating} readOnly size="sm" />
      </div>

      <h4 className="text-white font-semibold text-lg mb-2">{review.title}</h4>
      <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>

      <div className="flex items-center space-x-4 pt-4 border-t border-primary-700">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
            userLiked 
              ? 'bg-green-600 text-white' 
              : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
          }`}
          disabled={!user}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likes}</span>
        </button>
        
        <button
          onClick={handleDislike}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
            userDisliked 
              ? 'bg-red-600 text-white' 
              : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
          }`}
          disabled={!user}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{dislikes}</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;