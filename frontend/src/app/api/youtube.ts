const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getChannelInfo(channelId: string) {
  const response = await axios.get(`${API_URL}/channel/${channelId}`);
  return response.data;
} 