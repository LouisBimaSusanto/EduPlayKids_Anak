const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://edu-play-kids.vercel.app';

/**
 * Generic fetcher to handle requests, tokens, and errors
 */
const fetchClient = async (endpoint, options = {}) => {
  // Try to get token from localStorage (if in browser)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Tambahkan X-API-Key jika ada konfigurasi di .env
  if (process.env.NEXT_PUBLIC_BACKEND_API_KEY) {
    defaultHeaders['X-API-Key'] = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignored
    }
    throw new Error(errorData.message ? `${errorData.message} - Details: ${JSON.stringify(errorData)}` : `API Error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
  // === AUTH ===
  auth: {
    googleLogin: (data) => fetchClient('/api/v1/auth/google', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => fetchClient('/api/v1/auth/parent/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchClient('/api/v1/auth/parent/login', { method: 'POST', body: JSON.stringify(data) }), // Endpoint manual login
    requestOtp: (data) => fetchClient('/api/v1/auth/login/request-otp', { method: 'POST', body: JSON.stringify(data) }),
    verifyOtp: (data) => fetchClient('/api/v1/auth/login/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
    refresh: () => fetchClient('/api/v1/auth/refresh', { method: 'POST' }),
    getMe: () => fetchClient('/api/v1/auth/me'),
    updateMe: (data) => fetchClient('/api/v1/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
    childLogin: (data) => fetchClient('/api/v1/auth/child/login', { method: 'POST', body: JSON.stringify(data) }),
  },

  // === CHILDREN ===
  children: {
    create: (data) => fetchClient('/api/v1/children', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => fetchClient('/api/v1/children'),
    getById: (childId) => fetchClient(`/api/v1/children/${childId}`),
    update: (childId, data) => fetchClient(`/api/v1/children/${childId}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (childId) => fetchClient(`/api/v1/children/${childId}`, { method: 'DELETE' }),
    changeModule: (childId, data) => fetchClient(`/api/v1/children/${childId}/module`, { method: 'PATCH', body: JSON.stringify(data) }),
    generatePairingCode: (childId) => fetchClient(`/api/v1/children/${childId}/pairing-code`, { method: 'POST' }),
  },

  // === DASHBOARD ===
  dashboard: {
    getSummary: (childId) => fetchClient(`/api/v1/children/${childId}/dashboard`),
    getAnalytics: (childId) => fetchClient(`/api/v1/children/${childId}/analytics`),
    getReport: (childId) => fetchClient(`/api/v1/children/${childId}/report`), // might need different handling if it returns binary PDF
  },

  // === MODULES ===
  modules: {
    getAll: () => fetchClient('/api/v1/modules'),
    getById: (id) => fetchClient(`/api/v1/modules/${id}`),
    getLevels: (id) => fetchClient(`/api/v1/modules/${id}/levels`),
    getLevelById: (id) => fetchClient(`/api/v1/levels/${id}`),
  },

  // === GAME SESSIONS ===
  gameSessions: {
    recordSession: (data) => fetchClient('/api/v1/game-sessions', { method: 'POST', body: JSON.stringify(data) }),
    getHistory: (childId) => fetchClient(`/api/v1/game-sessions/child/${childId}`),
  },

  // === PROGRESS ===
  progress: {
    getByChildId: (childId) => fetchClient(`/api/v1/progress/${childId}`),
  },

  // === CONTENT ===
  content: {
    getAll: () => fetchClient('/api/v1/content'),
    getById: (id) => fetchClient(`/api/v1/content/${id}`),
    create: (data) => fetchClient('/api/v1/content', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchClient(`/api/v1/content/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // === COMMUNITY ===
  community: {
    getAll: () => fetchClient('/api/v1/community'),
    createPost: (data) => fetchClient('/api/v1/community', { method: 'POST', body: JSON.stringify(data) }),
    getPostById: (id) => fetchClient(`/api/v1/community/${id}`),
    updatePost: (id, data) => fetchClient(`/api/v1/community/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deletePost: (id) => fetchClient(`/api/v1/community/${id}`, { method: 'DELETE' }),
    toggleLike: (id) => fetchClient(`/api/v1/community/${id}/like`, { method: 'POST' }),
  },

  // === NOTIFICATIONS ===
  notifications: {
    registerToken: (data) => fetchClient('/api/v1/notifications/register-token', { method: 'POST', body: JSON.stringify(data) }),
    sendTest: (data) => fetchClient('/api/v1/notifications/send-test', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
