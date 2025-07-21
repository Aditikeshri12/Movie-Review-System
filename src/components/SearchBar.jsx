import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ onSearch, onFilter, selectedGenre, setSelectedGenre }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const genres = [
    'All',
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Biography'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleGenreChange = (genre) => {
    const genreValue = genre === 'All' ? 'all' : genre;
    setSelectedGenre(genreValue);
    onFilter(genreValue);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSearchSubmit} className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for movies..."
            className="w-full pl-10 pr-20 py-3 bg-primary-800 border border-primary-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-600 text-white px-4 py-1.5 rounded-md hover:bg-accent-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-primary-800 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenre === (genre === 'All' ? 'all' : genre)
                    ? 'bg-accent-600 text-white'
                    : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;