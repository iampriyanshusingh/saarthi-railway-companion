import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [trainUpdates, setTrainUpdates] = useState([]);
  const [platformUpdates, setPlatformUpdates] = useState([]);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);
    setSocket(newSocket);

    newSocket.on('trainUpdate', (update) => {
      setTrainUpdates(prev => [update, ...prev.slice(0, 9)]);
    });

    newSocket.on('platformUpdate', (update) => {
      setPlatformUpdates(prev => [update, ...prev.slice(0, 9)]);
    });

    return () => newSocket.close();
  }, []);

  const value = {
    socket,
    trainUpdates,
    platformUpdates
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};