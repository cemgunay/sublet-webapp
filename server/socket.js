const socketIo = require('socket.io');

let io;

exports.init = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};