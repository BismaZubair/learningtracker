import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import LogoutSummary from '../pages/LogoutSummary'; 
import { useLogout } from '../context/LogoutContext';

const Navbar = () => {
  const { showLogoutSummary } = useLogout();
  const { user, logout, sessionDuration } = useSession();
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const summary = logout();
    if (summary) {
      setSummaryData(summary);
      showLogoutSummary(summary);
      setShowSummary(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b-2 border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
       
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                <span className="text-2xl text-white">📚</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-800">LearnTrack</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}! 👋</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xl font-bold text-gray-800">LearnTrack</h1>
                <p className="text-xs text-gray-600">Hi, {user.name.split(' ')[0]}! 👋</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 flex items-center py-2 px-4 rounded-xl hover:bg-blue-50"
                >
                  <span className="mr-2">📊</span> Dashboard
                </Link>
                <Link 
                  to="/topics" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-200 flex items-center py-2 px-4 rounded-xl hover:bg-green-50"
                >
                  <span className="mr-2">📖</span> Topics
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
            
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-2xl shadow-sm border-2 border-white/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">⏱️</span>
                    <span className="text-sm font-semibold text-gray-800">{sessionDuration}</span>
                  </div>
                </div>
      
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 flex items-center"
                >
                  <span className="mr-2">🚪</span> Logout
                </button>
              </div>
            </div>

        
            <div className="md:hidden flex items-center space-x-4">
          
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 rounded-xl shadow-sm border-2 border-white/50">
                <div className="flex items-center space-x-1">
                  <span className="text-blue-600 text-sm">⏱️</span>
                  <span className="text-xs font-semibold text-gray-800">{sessionDuration}</span>
                </div>
              </div>

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <span className="text-2xl">✕</span>
                ) : (
                  <span className="text-2xl">☰</span>
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 animate-slideDown">
              <nav className="grid grid-cols-1 gap-2">
                <Link 
                  to="/" 
                  className="flex items-center px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <span className="mr-3 text-lg">📊</span>
                  Dashboard
                </Link>
                <Link 
                  to="/topics" 
                  className="flex items-center px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-green-50 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <span className="mr-3 text-lg">📖</span>
                  Topics
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="flex items-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold mt-2 transition-all duration-200"
                >
                  <span className="mr-3 text-lg">🚪</span>
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {showSummary && (
        <LogoutSummary 
          sessionDuration={summaryData} 
          onClose={() => {
            setShowSummary(false);
            window.location.href = '/login';
          }} 
        />
      )}
    </>
  );
};

export default Navbar;