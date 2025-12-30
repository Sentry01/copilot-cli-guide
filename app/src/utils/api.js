// API utility for making requests to the backend
// Uses relative URLs that work both locally (via Vite proxy) and in production (Vercel)

const API_BASE = '/api';

export async function apiGet(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function apiPost(endpoint, data, headers = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function apiPut(endpoint, data, headers = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function apiDelete(endpoint, headers = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Re-export for convenience
export default { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete };
