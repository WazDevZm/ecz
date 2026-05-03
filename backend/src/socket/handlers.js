export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('subscribe:dashboard', () => {
      socket.join('dashboard');
      console.log(`Client ${socket.id} subscribed to dashboard updates`);
    });

    socket.on('subscribe:alerts', (userId) => {
      socket.join(`alerts:${userId}`);
      console.log(`Client ${socket.id} subscribed to alerts for user ${userId}`);
    });

    socket.on('unsubscribe:dashboard', () => {
      socket.leave('dashboard');
    });

    socket.on('unsubscribe:alerts', (userId) => {
      socket.leave(`alerts:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Helper functions to emit events
export const emitNewPost = (io, post) => {
  io.to('dashboard').emit('new:post', post);
};

export const emitSentimentUpdate = (io, data) => {
  io.to('dashboard').emit('update:sentiment', data);
};

export const emitAlert = (io, userId, alert) => {
  io.to(`alerts:${userId}`).emit('alert:triggered', alert);
};
