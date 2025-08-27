import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadUserData = () => {
      if (user) {
        try {
          console.log('Loading data for user:', user.id);
          const userData = JSON.parse(localStorage.getItem('userData')) || {};
          const userTopics = userData[user.id]?.topics || [];
          const userSessions = userData[user.id]?.sessions || [];
          
          console.log('Topics loaded:', userTopics.length);
          console.log('Sessions loaded:', userSessions.length);
          
          setTopics(userTopics);
          setSessions(userSessions);
          
       
          const legacyTopics = JSON.parse(localStorage.getItem('topics')) || [];
          const legacySessions = JSON.parse(localStorage.getItem('sessions')) || [];
          
          if (legacyTopics.length > 0 && userTopics.length === 0) {
            console.log('Migrating legacy data...');
            setTopics(legacyTopics);
            setSessions(legacySessions);
            
            
            const updatedUserData = { ...userData };
            updatedUserData[user.id] = {
              topics: legacyTopics,
              sessions: legacySessions,
              migratedAt: new Date().toISOString()
            };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            
           
            localStorage.removeItem('topics');
            localStorage.removeItem('sessions');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setTopics([]);
          setSessions([]);
        }
      } else {
        setTopics([]);
        setSessions([]);
      }
      setIsLoading(false);
    };

    loadUserData();
  }, [user]);

  
  useEffect(() => {
    if (user && !isLoading) {
      try {
        console.log('Saving data for user:', user.id);
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData[user.id] = {
          topics,
          sessions,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('Topics saved:', topics.length);
        console.log('Sessions saved:', sessions.length);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  }, [topics, sessions, user, isLoading]);

  const addTopic = (topic) => {
    const newTopic = {
      id: Date.now().toString(), 
      name: topic.name,
      category: topic.category || '',
      priority: topic.priority || 'Medium',
      targetDate: topic.targetDate || '',
      goalHours: Number(topic.goalHours) || 0,
      createdAt: new Date().toISOString()
    };
    setTopics(prev => [...prev, newTopic]);
    return newTopic;
  };

  const updateTopic = (id, updates) => {
    setTopics(prev => prev.map(topic => 
      topic.id === id ? { ...topic, ...updates } : topic
    ));
  };

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(topic => topic.id !== id));
    setSessions(prev => prev.filter(session => session.topicId !== id));
  };

  const logSession = (session) => {
    const newSession = {
      id: Date.now().toString(), 
      topicId: session.topicId,
      duration: Number(session.duration) || 0,
      notes: session.notes || '',
      date: session.date || new Date().toISOString().split('T')[0]
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const getTopicProgress = (topicId) => {
    const topicSessions = sessions.filter(s => s.topicId === topicId);
    const totalMinutes = topicSessions.reduce((sum, s) => sum + s.duration, 0);
    const topic = topics.find(t => t.id === topicId);
    const goalHours = topic?.goalHours || 0;
    const progress = goalHours > 0 
      ? Math.min((totalMinutes / 60) / goalHours * 100, 100) 
      : 0;
    
    const isCompleted = goalHours > 0 && (totalMinutes / 60) >= goalHours;
    const isDeadlineExceeded = topic?.targetDate && new Date(topic.targetDate) < new Date();
    const isActive = !isCompleted && !isDeadlineExceeded;

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      progress,
      sessions: topicSessions.length,
      isCompleted,
      isDeadlineExceeded,
      isActive
    };
  };

  const getActiveTopics = () => {
    return topics.filter(topic => {
      const progress = getTopicProgress(topic.id);
      return progress.isActive;
    });
  };

  const getActiveTopicsCount = () => {
    return getActiveTopics().length;
  };

  const getTotalStudyTime = () => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    return (totalMinutes / 60).toFixed(1);
  };

  const filteredTopics = topics.filter(topic => {
    const matchesFilter = filter === 'all' || topic.category === filter;
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <LearningContext.Provider value={{
      topics,
      sessions,
      filteredTopics,
      filter,
      setFilter,
      searchQuery,
      setSearchQuery,
      addTopic,
      updateTopic,
      deleteTopic,
      logSession,
      getTopicProgress,
      getTotalStudyTime,
      getActiveTopics,
      getActiveTopicsCount,
      isAddModalOpen,
      setIsAddModalOpen,
      isLogModalOpen,
      setIsLogModalOpen,
      selectedTopic,
      setSelectedTopic,
      isLoading
    }}>
      {children}
    </LearningContext.Provider>
  );
};