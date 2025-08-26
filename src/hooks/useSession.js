import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useSession = () => {
  const { user, logout: authLogout } = useAuth();
  const [sessionDuration, setSessionDuration] = useState(0);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleLogout = useCallback(() => {
    if (!user || !user.loginTime) return '';
    
    const duration = Math.floor((Date.now() - user.loginTime) / 1000);
    const summary = formatTime(duration);
    authLogout();
    return summary;
  }, [user, authLogout, formatTime]);

  useEffect(() => {
    if (!user || !user.loginTime) return;

    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - user.loginTime) / 1000);
      setSessionDuration(duration);
      
      if (duration >= 10800) {
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, handleLogout]);

  return {
    user,
    logout: handleLogout,
    sessionDuration: formatTime(sessionDuration)
  };
};