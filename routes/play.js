module.exports = {
  registerMove: async function (socket, payload) {
    socket.broadcast.emit('play:receive', payload);
  },
  matchGame: async function (socket, payload) {
    // Check which player is first and assign X
    socket.broadcast.emit('join:response', { sign: 'X' });
  },
};
