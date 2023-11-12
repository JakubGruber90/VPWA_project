import io from 'socket.io-client';

let socket;

export function initializeSocket(user_id,user_name) {
  if (!socket) {
    socket = io('http://localhost:3333', {
      query: {
        user_id: user_id,
        user_name: user_name,
      },
    });
  }

  return socket;
}

export function getSocket() {
    if (!socket) {
      console.error('Socket not initialized. Call initializeSocket() first.');
    }
  
    return socket;
  }

export default socket