import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TopicsPage from './pages/TopicsPage';
import Layout from './components/Layout';
import AddTopicModal from './components/AddTopicModal';
import LogSessionModal from './components/LogSessionModal';
import LogoutSummary from './pages/LogoutSummary';
import { LogoutProvider } from './context/LogoutContext';

function App() {
  const [showLogoutSummary, setShowLogoutSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState('');

  const handleAutoLogout = (summary) => {
    setSessionSummary(summary);
    setShowLogoutSummary(true);
  };

  return (
    <AuthProvider>
        <LogoutProvider>
      <LearningProvider onAutoLogout={handleAutoLogout}>
      
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="topics" element={<TopicsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <AddTopicModal />
            <LogSessionModal />
            
            {showLogoutSummary && (
              <LogoutSummary 
                sessionDuration={sessionSummary} 
                onClose={() => setShowLogoutSummary(false)} 
              />
            )}
          </div>
        </Router>
      </LearningProvider>
      </LogoutProvider>
    </AuthProvider>
  );
}

export default App;