import React from 'react';

const LogoutSummary = ({ sessionDuration, onClose }) => {
  console.log('LogoutSummary rendered with duration:', sessionDuration);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Summary</h2>
          <div className="mb-6">
            <p className="text-gray-600">Your session lasted for:</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{sessionDuration}</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutSummary;