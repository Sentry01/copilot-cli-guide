import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSessionId, initializeSession } from '../utils/session';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    async function init() {
      try {
        const sid = getSessionId();
        setSessionId(sid);
        
        const userData = await initializeSession();
        setUser(userData);
        
        // Fetch user's progress
        const progressResponse = await fetch(`/api/progress/${sid}`);
        if (progressResponse.ok) {
          const progress = await progressResponse.json();
          const lessonIds = progress.map(p => p.lesson_id);
          setCompletedLessons(new Set(lessonIds));
        }
      } catch (error) {
        console.error('Failed to initialize user session:', error);
      } finally {
        setLoading(false);
      }
    }
    
    init();
  }, []);

  const markLessonComplete = async (lessonId) => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(
        `/api/progress/${sessionId}/lesson/${lessonId}`,
        { method: 'POST' }
      );
      
      if (response.ok) {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        
        // Check for newly unlocked achievements
        try {
          const achievementResponse = await fetch(
            '/api/achievements/check',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-session-id': sessionId
              }
            }
          );
          
          if (achievementResponse.ok) {
            const result = await achievementResponse.json();
            if (result.unlocked && result.unlocked.length > 0) {
              // Trigger achievement notification (will be handled by notification system)
              result.unlocked.forEach(achievement => {
                // Dispatch custom event for achievement unlock
                window.dispatchEvent(new CustomEvent('achievement-unlocked', {
                  detail: achievement
                }));
              });
            }
          }
        } catch (err) {
          console.error('Failed to check achievements:', err);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
    return false;
  };

  const unmarkLessonComplete = async (lessonId) => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(
        `/api/progress/${sessionId}/lesson/${lessonId}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setCompletedLessons(prev => {
          const newSet = new Set(prev);
          newSet.delete(lessonId);
          return newSet;
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to unmark lesson:', error);
    }
    return false;
  };

  const isLessonComplete = (lessonId) => {
    return completedLessons.has(lessonId);
  };

  const value = {
    user,
    sessionId,
    loading,
    completedLessons,
    markLessonComplete,
    unmarkLessonComplete,
    isLessonComplete,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
