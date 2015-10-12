var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('event', function(data){
    if (typeof data === 'object' &&
      data.hasOwnProperty('event')) {
      console.log('Broadcast', data);
      io.emit(data.event, data);
    }
  });
});
server.listen(3000);
