import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === formData.email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== formData.password) {
        throw new Error('Invalid password');
      }
      
      const userWithLoginTime = {
        ...user,
        loginTime: Date.now()
      };
      
      login(userWithLoginTime);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900 relative overflow-hidden py-8 px-4">
    
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80')] bg-cover bg-center opacity-20"></div>
      
   
      <div className="absolute top-10 left-4 md:top-20 md:left-20 text-4xl md:text-6xl text-white/30">📚</div>
      <div className="absolute bottom-20 right-6 md:bottom-40 md:right-32 text-3xl md:text-5xl text-white/25">📖</div>
      <div className="absolute top-1/4 right-1/5 md:top-1/3 md:right-1/4 text-2xl md:text-4xl text-white/20">🎓</div>
      <div className="absolute bottom-1/5 left-1/4 md:bottom-1/4 md:left-1/3 text-3xl md:text-5xl text-white/35">✏️</div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border-2 border-white/20 relative z-10 mx-4"
      >
      
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 md:p-3 rounded-full">
              <FiBookOpen className="text-2xl md:text-3xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Continue your learning journey</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 md:mb-6 text-center text-sm md:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 py-2 md:py-3 px-3 md:px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm md:text-base"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 py-2 md:py-3 px-3 md:px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pr-10 md:pr-12 text-sm md:text-base"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <FiEye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 md:py-4 rounded-xl text-white text-base md:text-lg font-semibold shadow-lg 
                       bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                <span className="text-sm md:text-base">Logging in...</span>
              </div>
            ) : (
              'Sign In to Learn'
            )}
          </motion.button>
        </form>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            New to Learning Tracker?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-blue-600 hover:text-blue-700 underline transition-colors text-sm md:text-base"
            >
              Start your journey
            </Link>
          </p>
        </div>

  
        <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-12 h-12 md:w-20 md:h-20 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-16 md:h-16 bg-purple-100 rounded-full opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default LoginPage;