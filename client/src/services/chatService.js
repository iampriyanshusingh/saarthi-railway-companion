import axios from 'axios';

const API_URL = '/api/chat';

const chatService = {
  sendMessage: async (message) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/message`, 
      { message },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    return response.data;
  }
};

export { chatService };