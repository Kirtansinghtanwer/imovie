import React, { useState } from 'react';
import { IconStar } from './Icons';

export const StarRating = ({
  rating = 0,
  max = 5,
  size = 18,
  interactive = false,
  onChange = () => {},
  showCount = false,
  count = 0,
  showScore = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  // If rating is out of 10 (e.g. 8.8), convert to 5-star scale for visual stars
  const normalizedRating = rating > 5 ? rating / 2 : rating;

  return (
    <div className="d-inline-flex align-items-center gap-1">
      <div className="d-flex align-items-center gap-1">
        {[...Array(max)].map((_, i) => {
          const starVal = i + 1;
          const isFilled = interactive
            ? (hoverRating || normalizedRating) >= starVal
            : normalizedRating >= starVal - 0.25;

          return (
            <span
              key={i}
              style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.15s ease' }}
              onMouseEnter={() => interactive && setHoverRating(starVal)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onChange(starVal)}
            >
              <IconStar size={size} filled={isFilled} color="#F59E0B" />
            </span>
          );
        })}
      </div>

      {showScore && (
        <span className="fw-bold text-white ms-1" style={{ fontSize: `${size * 0.85}px` }}>
          {rating ? (typeof rating === 'number' ? rating.toFixed(1) : rating) : '0.0'}
        </span>
      )}

      {showCount && count > 0 && (
        <span className="text-white-50 ms-1 small" style={{ fontSize: '0.78rem' }}>
          ({count.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
};
