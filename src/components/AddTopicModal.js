import React, { useState, useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

const categories = ['Programming', 'Design', 'Languages', 'Mathematics', 'Science', 'Business', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

const AddTopicModal = () => {
  const { isAddModalOpen, setIsAddModalOpen, addTopic } = useContext(LearningContext);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    priority: 'Medium',
    targetDate: '',
    goalHours: 0
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Topic name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.goalHours <= 0) {
      newErrors.goalHours = 'Goal hours must be greater than 0';
    }

    // Date validation - must be today or future
    if (formData.targetDate) {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      if (selectedDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addTopic(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: '',
      priority: 'Medium',
      targetDate: '',
      goalHours: 0
    });
    setErrors({});
  };

 
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setErrors({});
    setFormData({
      name: '',
      category: '',
      priority: 'Medium',
      targetDate: '',
      goalHours: 0
    });
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Add New Learning Topic</h2>
          <button 
            onClick={handleModalClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
    
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
         
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Topic Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full rounded-xl border-2 py-3 px-4 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter topic name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
         
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full rounded-xl border-2 py-3 px-4 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.category ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
      
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>
            
        
            <div>
              <label htmlFor="goalHours" className="block text-sm font-medium text-gray-700 mb-2">
                Goal Hours *
              </label>
              <input
                type="number"
                id="goalHours"
                name="goalHours"
                min="0.5"
                step="0.5"
                value={formData.goalHours}
                onChange={handleChange}
                required
                className={`w-full rounded-xl border-2 py-3 px-4 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.goalHours ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter goal hours (minimum 0.5)"
              />
              {errors.goalHours && (
                <p className="mt-1 text-sm text-red-600">{errors.goalHours}</p>
              )}
            </div>
            
           
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                min={getTodayDate()}
                className={`w-full rounded-xl border-2 py-3 px-4 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.targetDate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.targetDate && (
                <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                 Set a future deadline for this topic
              </p>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopicModal;