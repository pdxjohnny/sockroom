var ioUnbound = require('socket.io');

function bindToServer(server) {
  var io = ioUnbound(server);
  io.on('connection', function(socket) {
    socket.on('event', function(data) {
      if (typeof data === 'object' &&
        data.hasOwnProperty('event')) {
        console.log('Broadcast', data);
        io.emit(data.event, data);
      }
    });
  });
};

module.exports = bindToServer;
