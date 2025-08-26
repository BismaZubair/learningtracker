import React, { useState, useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

const priorityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800'
};

const priorityIcons = {
  High: '🔴',
  Medium: '🟡',
  Low: '🟢'
};

const TopicCard = ({ topic }) => {
  const {
    getTopicProgress,
    setIsLogModalOpen,
    setSelectedTopic,
    deleteTopic,
    sessions
  } = useContext(LearningContext);

  const [showSessions, setShowSessions] = useState(false);

  const { 
    progress, 
    totalHours, 
    sessions: sessionCount, 
    isCompleted,
    isDeadlineExceeded 
  } = getTopicProgress(topic.id);

  const topicSessions = sessions
    .filter(session => session.topicId === topic.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleLogSession = () => {
    if (!isDeadlineExceeded && !isCompleted) {
      setSelectedTopic(topic);
      setIsLogModalOpen(true);
    }
  };

  return (
    <div className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 md:p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
      isDeadlineExceeded ? 'border-red-300' : isCompleted ? 'border-green-300' : 'border-blue-300'
    }`}>

      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 flex items-center">
            <span className="mr-2">{isCompleted ? '✅' : isDeadlineExceeded ? '⏰' : '📚'}</span>
            {topic.name}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[topic.priority]}`}>
              {priorityIcons[topic.priority]} {topic.priority}
            </span>
            {topic.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {topic.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3 md:mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs md:text-sm font-medium text-gray-700">
            {isCompleted ? 'COMPLETED! 🎉' : 
             isDeadlineExceeded ? 'DEADLINE PASSED ⏰' : 
             `${progress.toFixed(1)}% complete`}
          </span>
          <span className="text-xs md:text-sm font-semibold text-gray-600">
            {totalHours} / {topic.goalHours || '∞'}h
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
          <div
            className={`h-2 md:h-3 rounded-full transition-all duration-500 ease-out ${
              isCompleted ? 'bg-green-500' : 
              isDeadlineExceeded ? 'bg-red-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
        <div className="flex items-center">
          <span className="mr-1 md:mr-2">📅</span>
          {topic.targetDate ? (
            <span className={isDeadlineExceeded ? 'text-red-500' : ''}>
              Due: {new Date(topic.targetDate).toLocaleDateString()}
            </span>
          ) : (
            'No deadline'
          )}
        </div>
        <div className="flex items-center">
          <span className="mr-1 md:mr-2">📊</span>
          {sessionCount} session{sessionCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        <button
          onClick={handleLogSession}
          disabled={isCompleted || isDeadlineExceeded}
          className={`py-2 px-3 md:px-4 rounded-xl font-medium text-xs md:text-sm transition-all duration-200 ${
            isCompleted || isDeadlineExceeded
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isCompleted ? 'Completed' : 
           isDeadlineExceeded ? 'Deadline Passed' : 'Log Session'}
        </button>

        <button
          onClick={() => setShowSessions(!showSessions)}
          className="py-2 px-3 md:px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium text-xs md:text-sm hover:bg-gray-50 transition-all duration-200"
        >
          {showSessions ? 'Hide Sessions' : 'Show Sessions'}
        </button>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this topic?')) {
              deleteTopic(topic.id);
            }
          }}
          className="py-2 px-3 md:px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium text-xs md:text-sm hover:from-red-600 hover:to-pink-700 transition-all duration-200 col-span-1 sm:col-span-2"
        >
          Delete Topic
        </button>
      </div>

      {showSessions && (
        <div className="mt-4 md:mt-6 border-t pt-4 md:pt-6">
          <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 flex items-center text-sm md:text-base">
            <span className="mr-2">📋</span> Session History
          </h4>
          {topicSessions.length > 0 ? (
            <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-60 overflow-y-auto">
              {topicSessions.map(session => (
                <div key={session.id} className="bg-gray-50 rounded-xl p-2 md:p-3">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <span className="font-medium text-xs md:text-sm">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {session.duration} mins
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-gray-600 text-xs md:text-sm mt-1">{session.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 md:py-4 text-gray-500">
              <span className="text-2xl">📝</span>
              <p className="mt-1 md:mt-2 text-sm">No sessions logged yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicCard;