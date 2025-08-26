import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiCalendar, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const countryCodes = [
    { code: '+92', label: 'Pakistan (+92)', digits: 10 },
    { code: '+91', label: 'India (+91)', digits: 10 },
    { code: '+1', label: 'USA/Canada (+1)', digits: 10 },
    { code: '+44', label: 'UK (+44)', digits: 10 },
    { code: '+971', label: 'UAE (+971)', digits: 9 },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+92',
    phone: '',
    age: '',
    gender: 'male',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const selectedCode = countryCodes.find(c => c.code === formData.countryCode);
      const maxLength = selectedCode ? selectedCode.digits : 10;
      setFormData(prev => ({ ...prev, phone: digitsOnly.slice(0, maxLength) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
        loginTime: Date.now()
      };
      
      register(userData);
      setSuccess('Registration successful! Starting your learning journey...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 relative overflow-hidden">
    
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80')] bg-cover bg-center opacity-20"></div>
   
      <div className="absolute top-24 left-24 text-6xl text-white/30">📚</div>
      <div className="absolute bottom-44 right-40 text-5xl text-white/25">🎓</div>
      <div className="absolute top-1/2 right-1/3 text-4xl text-white/20">✏️</div>
      <div className="absolute bottom-1/3 left-1/4 text-5xl text-white/35">📝</div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border-2 border-white/20 relative z-10 mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-full">
              <span className="text-3xl text-white">🎓</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Start Your Learning Journey
          </h2>
          <p className="text-gray-600">Join thousands of learners worldwide</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              👤 Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              📧 Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              📞 Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode" value={formData.countryCode} onChange={handleChange}
                className="w-1/3 rounded-xl border-2 border-gray-200 px-3 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                {countryCodes.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              🎂 Age
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number" id="age" name="age" min="0" max="120" value={formData.age} onChange={handleChange} required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              👥 Gender
            </label>
            <select
              id="gender" name="gender" value={formData.gender} onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password" name="password" value={formData.password} onChange={handleChange}
                required minLength="6"
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 pr-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              🔒 Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-10 pr-10 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white text-lg font-semibold shadow-lg 
                         bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 
                         focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Start Learning Journey'
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-green-600 hover:text-green-700 underline transition-colors"
            >
              Continue learning
            </Link>
          </p>
        </div>

        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-100 rounded-full opacity-50"></div>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-100 rounded-full opacity-50"></div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;