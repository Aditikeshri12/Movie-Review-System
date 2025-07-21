import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('releaseDate');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, debouncedSearchTerm, selectedGenre, sortBy]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder: 'desc'
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (selectedGenre && selectedGenre !== 'all') {
        params.append('genre', selectedGenre);
      }

      const response = await axios.get(`${API_URL}/movies?${params}`);
      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleFilter = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Discover Movies
        </h1>

        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-primary-800 text-white border border-primary-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="releaseDate">Release Date</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div className="text-gray-300">
            Showing {movies.length} movies
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 bg-primary-800 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                const shouldShow = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 2 && page <= currentPage + 2);

                if (!shouldShow) {
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      isCurrentPage
                        ? 'bg-accent-600 text-white'
                        : 'bg-primary-800 text-white hover:bg-primary-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 bg-primary-800 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;