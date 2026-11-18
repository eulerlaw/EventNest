import axios from 'axios';
import { mockBackend } from './mockBackend';

const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventnest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to get current user from localStorage
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('eventnest_user'));
  } catch {
    return null;
  }
};

// Auth Services
export const authService = {
  login: async (data) => {
    if (isGitHubPages) {
      return { data: mockBackend.login(data.email, data.password) };
    }
    try {
      return await api.post('/auth/login', data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.login(data.email, data.password) };
      throw err;
    }
  },
  register: async (data) => {
    if (isGitHubPages) {
      return { data: mockBackend.register(data) };
    }
    try {
      return await api.post('/auth/register', data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.register(data) };
      throw err;
    }
  },
  getMe: async () => {
    if (isGitHubPages) {
      const u = getCurrentUser();
      return { data: { success: true, user: u } };
    }
    try {
      return await api.get('/auth/me');
    } catch (err) {
      if (!err.response) return { data: { success: true, user: getCurrentUser() } };
      throw err;
    }
  },
  updateProfile: async (data) => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.updateProfile(u?._id, data) };
    }
    try {
      return await api.put('/auth/profile', data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.updateProfile(u?._id, data) };
      throw err;
    }
  }
};

// Event Services
export const eventService = {
  getEvents: async (params) => {
    if (isGitHubPages) {
      return { data: mockBackend.getEvents(params) };
    }
    try {
      return await api.get('/events', { params });
    } catch (err) {
      if (!err.response) return { data: mockBackend.getEvents(params) };
      throw err;
    }
  },
  getEventById: async (id) => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.getEventById(id, u?._id) };
    }
    try {
      return await api.get(`/events/${id}`);
    } catch (err) {
      if (!err.response) return { data: mockBackend.getEventById(id, u?._id) };
      throw err;
    }
  },
  createEvent: async (data) => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.createEvent(data, u?._id) };
    }
    try {
      return await api.post('/events', data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.createEvent(data, u?._id) };
      throw err;
    }
  },
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyOrganizedEvents: async () => {
    if (isGitHubPages) {
      return { data: mockBackend.getEvents() };
    }
    try {
      return await api.get('/events/organizer/my-events');
    } catch (err) {
      if (!err.response) return { data: mockBackend.getEvents() };
      throw err;
    }
  }
};

// Registration & QR Services
export const registrationService = {
  register: async (eventId) => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.registerForEvent(eventId, u) };
    }
    try {
      return await api.post(`/registrations/${eventId}`);
    } catch (err) {
      if (!err.response) return { data: mockBackend.registerForEvent(eventId, u) };
      throw err;
    }
  },
  getMyRegistrations: async () => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.getMyRegistrations(u?._id) };
    }
    try {
      return await api.get('/registrations/my');
    } catch (err) {
      if (!err.response) return { data: mockBackend.getMyRegistrations(u?._id) };
      throw err;
    }
  },
  cancelRegistration: async (id) => {
    if (isGitHubPages) {
      return { data: mockBackend.cancelRegistration(id) };
    }
    try {
      return await api.put(`/registrations/${id}/cancel`);
    } catch (err) {
      if (!err.response) return { data: mockBackend.cancelRegistration(id) };
      throw err;
    }
  },
  getEventAttendees: async (eventId) => {
    if (isGitHubPages) {
      return { data: mockBackend.getEventAttendees(eventId) };
    }
    try {
      return await api.get(`/registrations/event/${eventId}`);
    } catch (err) {
      if (!err.response) return { data: mockBackend.getEventAttendees(eventId) };
      throw err;
    }
  },
  verifyAttendance: async (data) => {
    if (isGitHubPages) {
      return { data: mockBackend.verifyAttendance(data) };
    }
    try {
      return await api.post('/registrations/verify-attendance', data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.verifyAttendance(data) };
      throw err;
    }
  }
};

// Feedback & Sentiment Services
export const feedbackService = {
  submitFeedback: async (eventId, data) => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.submitFeedback(eventId, data, u) };
    }
    try {
      return await api.post(`/feedback/${eventId}`, data);
    } catch (err) {
      if (!err.response) return { data: mockBackend.submitFeedback(eventId, data, u) };
      throw err;
    }
  },
  getEventFeedback: async (eventId) => {
    if (isGitHubPages) {
      return { data: mockBackend.getEventFeedback(eventId) };
    }
    try {
      return await api.get(`/feedback/event/${eventId}`);
    } catch (err) {
      if (!err.response) return { data: mockBackend.getEventFeedback(eventId) };
      throw err;
    }
  }
};

// Recommendation Services
export const recommendationService = {
  getRecommendations: async () => {
    const u = getCurrentUser();
    if (isGitHubPages) {
      return { data: mockBackend.getRecommendations(u) };
    }
    try {
      return await api.get('/recommendations');
    } catch (err) {
      if (!err.response) return { data: mockBackend.getRecommendations(u) };
      throw err;
    }
  }
};

// Notification Services
export const notificationService = {
  getNotifications: async () => {
    if (isGitHubPages) {
      return { data: { success: true, unreadCount: 1, notifications: mockBackend.notifications } };
    }
    try {
      return await api.get('/notifications');
    } catch (err) {
      if (!err.response) return { data: { success: true, unreadCount: 1, notifications: mockBackend.notifications } };
      throw err;
    }
  },
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all')
};

// Admin Services
export const adminService = {
  getStats: async () => {
    if (isGitHubPages) {
      return { data: mockBackend.getAdminStats() };
    }
    try {
      return await api.get('/admin/stats');
    } catch (err) {
      if (!err.response) return { data: mockBackend.getAdminStats() };
      throw err;
    }
  },
  getUsers: async () => {
    if (isGitHubPages) {
      return { data: { success: true, count: mockBackend.users.length, users: mockBackend.users } };
    }
    try {
      return await api.get('/admin/users');
    } catch (err) {
      if (!err.response) return { data: { success: true, count: mockBackend.users.length, users: mockBackend.users } };
      throw err;
    }
  },
  toggleUserStatus: async (id) => {
    const user = mockBackend.users.find(u => u._id === id);
    if (user) user.isActive = !user.isActive;
    return { data: { success: true, user } };
  },
  getAdminEvents: async () => {
    if (isGitHubPages) {
      return { data: { success: true, count: mockBackend.events.length, events: mockBackend.events } };
    }
    try {
      return await api.get('/admin/events');
    } catch (err) {
      if (!err.response) return { data: { success: true, count: mockBackend.events.length, events: mockBackend.events } };
      throw err;
    }
  },
  updateEventApproval: (id, approvalStatus) => api.put(`/admin/events/${id}/approval`, { approvalStatus })
};

// Chatbot Services
export const chatbotService = {
  query: async (message) => {
    if (isGitHubPages) {
      return { data: { success: true, data: mockBackend.askChatbot(message) } };
    }
    try {
      return await api.post('/chatbot/query', { message });
    } catch (err) {
      if (!err.response) return { data: { success: true, data: mockBackend.askChatbot(message) } };
      throw err;
    }
  }
};

export default api;
