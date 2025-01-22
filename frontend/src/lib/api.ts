import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 디버깅을 위한 인터셉터 추가
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const getChannelInfo = async (channelId: string) => {
  try {
    const response = await api.get(`/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw error;
  }
};

export const getChannelVideos = async (channelId: string) => {
  try {
    const response = await api.get(`/channel/${channelId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};

export const getVideoComments = async (videoId: string) => {
  try {
    // 백엔드 라우트와 일치하도록 수정
    const response = await api.get(`/channel/videos/${videoId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video comments:', error);
    throw error;
  }
};

export const analyzeVideoComments = async (videoId: string) => {
  try {
    // 백엔드 라우트와 일치하도록 수정
    const response = await api.get(`/channel/videos/${videoId}/analysis`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing video comments:', error);
    throw error;
  }
};

export const getChannelComments = async (channelId: string) => {
  try {
    const response = await api.get(`/channel/${channelId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel comments:', error);
    throw error;
  }
};

export const getChartAnalysis = async (chartType: string, data: any) => {
  try {
    // 백엔드 라우트와 일치하도록 수정
    const response = await api.post('/channel/analysis/chart', {
      chart_type: chartType,
      data: data
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Error getting chart analysis:', error);
    throw error;
  }
};
