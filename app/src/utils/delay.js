// Utility to add artificial delay for testing loading states
// Can be removed or set to 0 in production
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Configuration
export const LOADING_DELAY = process.env.NODE_ENV === 'development' ? 800 : 0;
