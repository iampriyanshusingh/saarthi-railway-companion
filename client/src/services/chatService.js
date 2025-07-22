import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/chat`;

const chatService = {
  sendMessage: async (message) => {
    console.log('message', message);
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/message`, 
      { message },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    console.log('data', response.data);
    return response;
  }
};

export { chatService };