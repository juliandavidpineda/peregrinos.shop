import React, { useState } from 'react';

const ReviewStars = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`text-2xl transition-transform hover:scale-110 ${
              readonly ? 'cursor-default' : 'cursor-pointer'
            } ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            {isFilled ? '⭐' : '☆'}
          </button>
        );
      })}
    </div>
  );
};

export default ReviewStars;