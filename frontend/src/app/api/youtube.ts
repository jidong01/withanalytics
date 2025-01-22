import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getChannelInfo(channelId: string) {
  console.log('Calling API:', `${API_URL}/channel/${channelId}`); // 디버깅용
  const response = await axios.get(`${API_URL}/channel/${channelId}`);
  return response.data;
}

export async function getChannelVideos(channelId: string) {
  console.log('Calling API:', `${API_URL}/channel/${channelId}/videos`); // 디버깅용
  const response = await axios.get(`${API_URL}/channel/${channelId}/videos`);
  return response.data;
} 