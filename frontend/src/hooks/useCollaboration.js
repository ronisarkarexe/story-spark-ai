import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useCollaboration = (storyId) => {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!storyId) return;
    
    const s = io('http://localhost:5000');
    setSocket(s);
    s.emit('join-story', storyId);
    
    s.on('update', (data) => setContent(data));
    s.on('user-joined', () => setUsers(prev => [...prev, 'User']));

    return () => s.close();
  }, [storyId]);

  const sendUpdate = (newContent) => {
    setContent(newContent);
    socket?.emit('edit', { storyId, content: newContent });
  };

  return { content, users, sendUpdate };
};