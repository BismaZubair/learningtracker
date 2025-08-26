import React, { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { setIsAddModalOpen, getTotalStudyTime } = useContext(LearningContext);

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-80 bg-gradient-to-b from-blue-900 to-purple-900 text-white">
        <div className="flex flex-col flex-grow pt-8 pb-6 overflow-y-auto">

          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl mr-3">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              LearnTrack
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col px-6">

            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border-2 border-white/20">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-xl mr-3">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <h3 className="text-sm font-medium text-blue-200">Total Study Time</h3>
                </div>
                <p className="text-3xl font-bold text-white">{getTotalStudyTime()} hours</p>
                <p className="text-xs text-blue-200 mt-2">Total time invested in learning</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mb-8 flex items-center justify-center"
            >
              <span className="mr-2">➕</span> Add New Topic
            </button>

            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wider text-blue-200 mb-4 flex items-center">
                <span className="mr-2">🔗</span> Quick Navigation
              </h3>
              <nav className="space-y-3">
                <Link
                  to="/"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="mr-3">📊</span>
                  Dashboard
                  <span className="ml-auto opacity-0 group-hover:opacity-100">→</span>
                </Link>
                <Link
                  to="/topics"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="mr-3">📚</span>
                  All Topics
                  <span className="ml-auto opacity-0 group-hover:opacity-100">→</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-blue-200 text-center">
            Keep learning, keep growing 🌱
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;