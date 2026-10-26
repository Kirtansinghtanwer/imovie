let ioInstance = null;

function initSocket(server, corsOptions) {
  const { Server } = require("socket.io");
  ioInstance = new Server(server, {
    cors: corsOptions
  });

  ioInstance.on("connection", (socket) => {
    // Join room for a specific show
    socket.on("join-show", (showId) => {
      if (showId) {
        socket.join(`show_${showId}`);
      }
    });

    socket.on("leave-show", (showId) => {
      if (showId) {
        socket.leave(`show_${showId}`);
      }
    });
  });

  return ioInstance;
}

function broadcastSeatUpdate(showId, seatData) {
  if (ioInstance && showId) {
    ioInstance.to(`show_${showId}`).emit("seats-updated", {
      showId,
      ...seatData,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  initSocket,
  broadcastSeatUpdate
};
