import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected endpoint, clear stale token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('eventnest_token');
        localStorage.removeItem('eventnest_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Event Services
export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyOrganizedEvents: () => api.get('/events/organizer/my-events')
};

// Registration & QR Services
export const registrationService = {
  register: (eventId) => api.post(`/registrations/${eventId}`),
  getMyRegistrations: () => api.get('/registrations/my'),
  cancelRegistration: (id) => api.put(`/registrations/${id}/cancel`),
  getEventAttendees: (eventId) => api.get(`/registrations/event/${eventId}`),
  verifyAttendance: (data) => api.post('/registrations/verify-attendance', data)
};

// Feedback & Sentiment Services
export const feedbackService = {
  submitFeedback: (eventId, data) => api.post(`/feedback/${eventId}`, data),
  getEventFeedback: (eventId) => api.get(`/feedback/event/${eventId}`)
};

// Recommendation Services
export const recommendationService = {
  getRecommendations: (limit = 6) => api.get('/recommendations', { params: { limit } })
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getAdminEvents: () => api.get('/admin/events'),
  updateEventApproval: (id, approvalStatus) => api.put(`/admin/events/${id}/approval`, { approvalStatus })
};

// Chatbot Services
export const chatbotService = {
  query: (message) => api.post('/chatbot/query', { message })
};

export default api;
