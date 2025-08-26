import React, { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import TopicList from '../components/TopicList';

const TopicsPage = () => {
  const { 
    filter, 
    setFilter, 
    searchQuery, 
    setSearchQuery,
    setIsAddModalOpen,
    topics
  } = useContext(LearningContext); 

  const categories = ['Programming', 'Design', 'Languages', 'Mathematics', 'Science', 'Business', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            📚 My Learning Topics
          </h1>
          <p className="text-gray-600">Manage and track all your learning subjects</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">My Learning Library</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">➕</span> Add New Topic
          </button>
        </div>

      
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">🔍</span> Search Topics
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Search by topic name..."
              />
            </div>
            <div>
              <label htmlFor="filter" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📂</span> Filter by Category
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border-2 border-white/30">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your library is empty</h3>
            <p className="text-gray-600 mb-6">Start by adding your first learning topic!</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
            >
              Add Your First Topic
            </button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
            <TopicList />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;