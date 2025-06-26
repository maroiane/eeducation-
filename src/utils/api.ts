import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData: { username: string; password: string; level: string }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
};

export const adminAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getVideos: async () => {
    const response = await api.get('/admin/videos');
    return response.data;
  },

  addVideo: async (videoData: any) => {
    const response = await api.post('/admin/videos', videoData);
    return response.data;
  },

  updateVideo: async (videoId: string, videoData: any) => {
    const response = await api.put(`/admin/videos/${videoId}`, videoData);
    return response.data;
  },

  deleteVideo: async (videoId: string) => {
    const response = await api.delete(`/admin/videos/${videoId}`);
    return response.data;
  },

  updateUserSubscription: async (userId: string, subjectId: string, status: string) => {
    const response = await api.post(`/admin/users/${userId}/subscription/${subjectId}`, { status });
    return response.data;
  },

  cancelUserSubscription: async (userId: string, subjectId: string) => {
    const response = await api.delete(`/admin/users/${userId}/subscription/${subjectId}`);
    return response.data;
  },
};

export const subjectsAPI = {
  getByLevel: async (level: string) => {
    const response = await api.get(`/subjects/${level}`);
    return response.data;
  },
};

export const lessonsAPI = {
  getBySubject: async (subjectId: string) => {
    const response = await api.get(`/lessons/subject/${subjectId}`);
    return response.data;
  },

  getById: async (lessonId: string) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  getSecureVideo: async (lessonId: string) => {
    const response = await api.get(`/secure-video/${lessonId}`);
    return response.data;
  },
};

export default api;