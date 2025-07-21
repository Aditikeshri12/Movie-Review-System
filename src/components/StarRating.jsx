import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (selectedRating) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleStarHover = (selectedRating) => {
    if (!readOnly) {
      setHoverRating(selectedRating);
    }
  };

  const handleStarLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-all duration-200`}
            disabled={readOnly}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isActive 
                  ? 'text-warning-400 fill-current' 
                  : 'text-gray-600 hover:text-warning-400'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;