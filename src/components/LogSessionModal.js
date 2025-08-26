import React, { useState, useContext, useEffect, useRef } from 'react';
import { LearningContext } from '../context/LearningContext';

const LogSessionModal = () => {
  const { 
    isLogModalOpen, 
    setIsLogModalOpen, 
    selectedTopic,
    getTopicProgress,
    logSession,
    sessions
  } = useContext(LearningContext);

  const [formData, setFormData] = useState({
    duration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [error, setError] = useState('');
  const durationInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLogModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsLogModalOpen]);

  useEffect(() => {
    if (isLogModalOpen && durationInputRef.current) {
      setTimeout(() => {
        durationInputRef.current?.focus();
      }, 100);
    }
  }, [isLogModalOpen]);

  useEffect(() => {
    if (isLogModalOpen && selectedTopic) {
      setFormData({
        duration: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      setError('');
    }
  }, [isLogModalOpen, selectedTopic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTopic) {
      setError("No topic selected");
      return;
    }

    const progress = getTopicProgress(selectedTopic.id);
    if (progress.isDeadlineExceeded) {
      setError("Cannot log session - deadline has passed");
      return;
    }

    if (!formData.duration || isNaN(formData.duration)) {
      setError("Please enter a valid duration");
      return;
    }

    const durationMinutes = parseInt(formData.duration);
    if (durationMinutes <= 0) {
      setError("Duration must be at least 1 minute");
      return;
    }

    const pastSessions = sessions.filter(s => s.topicId === selectedTopic.id);
    const pastMinutes = pastSessions.reduce((sum, s) => sum + s.duration, 0);
    const goalMinutes = selectedTopic.goalHours * 60;

    if (selectedTopic.goalHours > 0 && pastMinutes + durationMinutes > goalMinutes) {
      const remainingMinutes = Math.max(0, goalMinutes - pastMinutes);
      setError(
        `You've already logged ${pastMinutes} minutes (${(pastMinutes/60).toFixed(1)} hours).\n` +
        `Goal: ${goalMinutes} minutes (${selectedTopic.goalHours} hours).\n` +
        `You can log up to ${remainingMinutes} more minutes.`
      );
      return;
    }

    logSession({
      topicId: selectedTopic.id,
      duration: durationMinutes,
      notes: formData.notes,
      date: formData.date
    });

    setIsLogModalOpen(false);
    setFormData({
      duration: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (!isLogModalOpen || !selectedTopic) return null;

  const pastSessions = sessions.filter(s => s.topicId === selectedTopic.id);
  const pastMinutes = pastSessions.reduce((sum, s) => sum + s.duration, 0);
  const goalMinutes = selectedTopic.goalHours * 60;
  const remainingMinutes = Math.max(0, goalMinutes - pastMinutes);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
   
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Log Session for {selectedTopic.name}
          </h2>
          <button 
            onClick={() => setIsLogModalOpen(false)} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 whitespace-pre-line rounded-xl">
              {error}
            </div>
          )}

          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-medium text-gray-600 text-sm">Goal</div>
                <div className="font-bold text-lg text-blue-600">
                  {selectedTopic.goalHours > 0 
                    ? `${selectedTopic.goalHours}h`
                    : 'Not set'}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 text-sm">Logged</div>
                <div className="font-bold text-lg text-green-600">
                  {(pastMinutes/60).toFixed(1)}h
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600 text-sm">Remaining</div>
                <div className="font-bold text-lg text-purple-600">
                  {selectedTopic.goalHours > 0 
                    ? `${(remainingMinutes/60).toFixed(1)}h`
                    : '∞'}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                ref={durationInputRef}
                type="number"
                id="duration"
                name="duration"
                min="1"
                max={selectedTopic.goalHours > 0 ? remainingMinutes : undefined}
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <p className="mt-2 text-xs text-gray-500">
                Minimum: 1 minute | Maximum: {selectedTopic.goalHours > 0 ? remainingMinutes : 'unlimited'} minutes
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="What did you work on? What did you learn?"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Log Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogSessionModal;