import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getChannelInfo(channelId: string) {
  const url = `${API_URL}/channel/${channelId}`;
  console.log('API URL:', url);  // API URL 로깅
  console.log('API_URL env:', process.env.NEXT_PUBLIC_API_URL);  // 환경변수 로깅
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getChannelVideos(channelId: string) {
  console.log('Calling API:', `${API_URL}/channel/${channelId}/videos`); // 디버깅용
  const response = await axios.get(`${API_URL}/channel/${channelId}/videos`);
  return response.data;
}

export async function getChannelComments(channelId: string) {
  const url = `${API_URL}/channel/${channelId}/comments`;
  console.log('Fetching comments from:', url);  // 디버깅용
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching channel comments:', error);
    throw error;
  }
} 