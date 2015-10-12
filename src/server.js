var ioUnbound = require('socket.io');

function bindHelper(httpServer) {
  return new bindToServer(httpServer);
}

function bindToServer(httpServer) {
  this.rooms = {};
  this.io = ioUnbound(httpServer);
  this.io.on('connection', function(socket) {
    // console.log(process.memoryUsage());
    // Create a name for the client
    socket.clientName = String(Math.random());
    // Send the client their name
    socket.emit('name', socket.clientName);
    // Send targeted events
    socket.on('join', function(data) {
      // Make sure there is a room to join
      if (typeof data === 'object' &&
        data.hasOwnProperty('room')) {
        // Create the room and add the client to it
        this.createRoom(data.room, socket);
        // Let the client know the room has been created
        socket.emit('created', data.room);
        // Create a new handler for when an event for this room is received
        socket.on(data.room, this.sendToAllInRoom(data.room));
      }
      // console.log(process.memoryUsage());
    }.bind(this));
    // Delete on disconnect
    socket.on('disconnect', function(data) {
      console.log(this);
      this.deleteClient(socket);
      // console.log(process.memoryUsage());
    }.bind(this));
  }.bind(this));
  return this;
};

bindToServer.prototype.createRoom = function (room, socket) {
  if (!socket.hasOwnProperty('rooms')) {
    socket.rooms = [];
  }
  if (!this.rooms.hasOwnProperty(room)) {
    this.rooms[room] = [];
  }
  // Make sure were not already in the room
  if (socket.rooms.indexOf(room) != -1) {
    socket.rooms.push(room);
    this.rooms[room].push(socket);
  }
};

bindToServer.prototype.deleteClient = function (socket) {
  // Make sure the client is in a room
  if (socket.hasOwnProperty('rooms')) {
    for (var i = 0; i < socket.rooms.length; i++) {
      // Make sure there is a room to check in
      if (this.rooms.hasOwnProperty(socket.rooms[i])) {
        // Go though all the clients that are in the room
        var roomArray = this.rooms[socket.rooms[i]];
        for (var j = 0; j < roomArray.length; j++) {
          // If the client name matchs take the client out of the room
          if (roomArray[j].clientName === socket.clientName) {
            roomArray.splice(j, 1);
            break;
          }
        }
        // Delete empty rooms
        if (roomArray.length < 1) {
          delete this.rooms[socket.rooms[i]];
        }
      }
    }
  }
};

bindToServer.prototype.sendToAllInRoom = function (room) {
  var sendToAll = function(message) {
    if (this.rooms.hasOwnProperty(room)) {
      for (var i = 0; i < this.rooms[room].length; i++) {
        this.rooms[room][i].emit(data.room, message);
      }
    }
  }
  return sendToAll.bind(this);
};

module.exports = bindHelper;
