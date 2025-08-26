import React, { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import ProgressChart from '../components/ProgressChart';
import TopicCard from '../components/TopicCard';

const DashboardPage = () => {
  const { 
    topics, 
    getTopicProgress, 
    getTotalStudyTime, 
    getActiveTopicsCount,
    getActiveTopics 
  } = useContext(LearningContext);

  const activeTopics = getActiveTopics();

  const upcomingTopics = topics
    .filter(topic => {
      const progress = getTopicProgress(topic.id);
      return topic.targetDate && 
             new Date(topic.targetDate) > new Date() &&
             !progress.isCompleted;
    })
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
    .slice(0, 3);

  const categoryHours = {};
  activeTopics.forEach(topic => {
    const progress = getTopicProgress(topic.id);
    if (topic.category) {
      categoryHours[topic.category] = (categoryHours[topic.category] || 0) + parseFloat(progress.totalHours);
    }
  });

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📚 Learning Dashboard
        </h1>
        <p className="text-gray-600">Track your progress and stay organized</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Total Study Time</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{getTotalStudyTime()} hours</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Active Topics</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{getActiveTopicsCount()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {topics.reduce((sum, topic) => sum + getTopicProgress(topic.id).sessions, 0)}
          </p>
        </div>
      </div>

  
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📈</span> Study Progress
        </h2>
        <ProgressChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⏰</span> Upcoming Deadlines
          </h3>
          {upcomingTopics.length > 0 ? (
            <div className="space-y-4">
              {upcomingTopics.map(topic => {
                const progress = getTopicProgress(topic.id);
                return (
                  <div key={topic.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                      <p className="text-sm text-gray-600">{topic.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${progress.isDeadlineExceeded ? 'text-red-500' : 'text-gray-700'}`}>
                        {new Date(topic.targetDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((new Date(topic.targetDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl">🎯</span>
              <p className="text-gray-500 mt-4">No upcoming deadlines</p>
            </div>
          )}
        </div>


        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📂</span> Hours by Category
          </h3>
          {Object.keys(categoryHours).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(categoryHours).map(([category, hours]) => (
                <div key={category} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                  <span className="font-semibold text-gray-800">{category}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {hours.toFixed(1)} hours
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl">📊</span>
              <p className="text-gray-500 mt-4">No category data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-white/30">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🔥</span> Recent Active Topics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTopics.slice(0, 3).map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;