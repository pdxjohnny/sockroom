var ioUnbound = require('socket.io');

function bindHelper(httpServer) {
  return new bindToServer(httpServer);
}

function bindToServer(httpServer) {
  this.rooms = {};
  this.io = ioUnbound(httpServer);
  this.io.on('connection', function(socket) {
    // console.log('connection', process.memoryUsage());
    // Create a name for the client
    var clientName = String(Math.random());
    socket.clientName = clientName;
    // Send the client their name
    socket.emit('name', clientName);
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
        socket.on(data.room, this.sendToAllInRoom(data.room, clientName));
      }
      // console.log('join', process.memoryUsage());
    }.bind(this));
    // Delete on disconnect
    socket.on('disconnect', function(data) {
      this.deleteClient(socket);
    }.bind(this));
  }.bind(this));
  return this;
};

bindToServer.prototype.createRoom = function (room, socket) {
  if (!socket.hasOwnProperty('sockrooms')) {
    socket.sockrooms = [];
  }
  if (!this.rooms.hasOwnProperty(room)) {
    this.rooms[room] = [];
  }
  // Make sure were not already in the room
  if (socket.sockrooms.length < 1 || socket.sockrooms.indexOf(room) != -1) {
    socket.sockrooms.push(room);
    this.rooms[room].push(socket);
  }
};

bindToServer.prototype.deleteClient = function (socket) {
  // Make sure the client is in a room
  if (socket.hasOwnProperty('sockrooms')) {
    for (var i = 0; i < socket.sockrooms.length; i++) {
      // Make sure there is a room to check in
      if (this.rooms.hasOwnProperty(socket.sockrooms[i])) {
        // Go though all the clients that are in the room
        var roomArray = this.rooms[socket.sockrooms[i]];
        for (var j = 0; j < roomArray.length; j++) {
          // If the client name matchs take the client out of the room
          if (roomArray[j].clientName === socket.clientName) {
            roomArray.splice(j, 1);
            break;
          }
        }
        // Delete empty rooms
        if (roomArray.length < 1) {
          delete this.rooms[socket.sockrooms[i]];
        }
      }
    }
  }
};

bindToServer.prototype.sendToAllInRoom = function (room, clientName) {
  var sendToAll = function(message) {
    if (this.rooms.hasOwnProperty(room)) {
      for (var i = 0; i < this.rooms[room].length; i++) {
        if (this.rooms[room][i].clientName !== clientName) {
          this.rooms[room][i].emit(room, message);
        }
      }
    }
  }
  return sendToAll.bind(this);
};

module.exports = bindHelper;
