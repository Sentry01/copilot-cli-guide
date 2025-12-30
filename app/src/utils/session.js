// Session management utility

const SESSION_KEY = 'copilot_cli_guide_session';

/**
 * Get or create a session ID
 * @returns {string} Session ID
 */
export function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Generate a unique session ID
 * @returns {string} Unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Clear the current session
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Initialize user session with backend
 * @returns {Promise<object>} User object
 */
export async function initializeSession() {
  const sessionId = getSessionId();
  
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to initialize session');
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error initializing session:', error);
    throw error;
  }
}
