import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Film, Search, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary-800 border-b border-primary-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-accent-400 transition-colors">
            <Film className="w-8 h-8" />
            <span className="font-bold text-xl">CineReview</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Movies
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-primary-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <Link 
                        to={`/profile/${user.id}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary-600 hover:text-white"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-primary-600 hover:text-white"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent-600 text-white px-4 py-2 rounded-md hover:bg-accent-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-700 border-t border-primary-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to={`/profile/${user.id}`}
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 bg-accent-600 text-white hover:bg-accent-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;