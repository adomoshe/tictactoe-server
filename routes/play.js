const { Errors, mapErrorDetails, sanitizeErrorMessage } = require('../util');

module.exports = {
  registerMove: async function(socket, payload) {
  // if (error) {
  //   return callback({
  //     error: Errors.INVALID_PAYLOAD,
  //     errorDetails: mapErrorDetails(error.details),
  //   });
  // }

  // persist the entity
  // try {
  //   // await todoRepository.save(value);
  // } catch (e) {
  //   return callback({
  //     error: sanitizeErrorMessage(e),
  //   });
  // }

  // // acknowledge the creation
  // callback({
  //   data: value.id,
  // });

  // notify the other users
  socket.broadcast.emit('play:receive', payload);
  },
  matchGame: async function(socket, payload) {
    // if (error) {
    //   return callback({
    //     error: Errors.INVALID_PAYLOAD,
    //     errorDetails: mapErrorDetails(error.details),
    //   });
    // }
  
    // persist the entity
    // try {
    //   // await todoRepository.save(value);
    // } catch (e) {
    //   return callback({
    //     error: sanitizeErrorMessage(e),
    //   });
    // }
  
    // // acknowledge the creation
    // callback({
    //   data: value.id,
    // });
  
    // notify the other users
    socket.broadcast.emit('join:response', { sign: 'X' });
    },
};
