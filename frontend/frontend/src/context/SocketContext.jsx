import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinProject = (projectId) => {
    if (socket && connected) {
      socket.emit('join-project', projectId);
      console.log('👤 Joined project room:', projectId);
    }
  };

  const emitProgressUpdate = (data) => {
    if (socket && connected) {
      socket.emit('progress-update', data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, joinProject, emitProgressUpdate }}>
      {children}
    </SocketContext.Provider>
  );
};