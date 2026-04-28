import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { baseURL } from './api';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const ref = useRef(null);

  useEffect(function() {
    if (!user) {
      if (ref.current) {
        ref.current.disconnect();
        ref.current = null;
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(baseURL, {
      auth: { token: token },
      transports: ['websocket', 'polling']
    });

    s.on('connect_error', function(err) {
      console.log('socket error:', err.message);
    });

    ref.current = s;
    setSocket(s);

    return function() {
      s.disconnect();
      ref.current = null;
      setSocket(null);
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
