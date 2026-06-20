import React from 'react';

interface StarRatingDisplayProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ 
  rating, 
  totalRatings = 0, 
  size = 'md',
  showCount = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  const renderStarIcon = (index: number) => {
    if (rating >= index) return <i className="fa-solid fa-star" />;
    if (rating >= index - 0.5) return <i className="fa-solid fa-star-half-stroke" />;
    return <i className="fa-regular fa-star" />;
  };

  return (
    <div className={`flex items-center gap-1.5 ${sizeClasses[size]}`}>
      <div className="flex text-yellow-400 drop-shadow-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{renderStarIcon(star)}</span>
        ))}
      </div>
      {showCount && (
        <span className="text-slate-500 font-medium ml-1">
          {rating > 0 ? Number(rating).toFixed(1) : "New"} 
          {totalRatings > 0 && <span className="text-slate-400 ml-1">({totalRatings})</span>}
        </span>
      )}
    </div>
  );
};

export default StarRatingDisplay;
