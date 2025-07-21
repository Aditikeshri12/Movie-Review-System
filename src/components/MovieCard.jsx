import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const formatDate = (date) => {
    return new Date(date).getFullYear();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Link 
      to={`/movie/${movie._id}`} 
      className="group block bg-primary-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(movie.releaseDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-warning-400 fill-current" />
            <span className="text-white font-medium">
              {movie.rating.average.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              ({movie.rating.count})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {movie.genre.slice(0, 2).map((genre, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-accent-600 text-white text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;