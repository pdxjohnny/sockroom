var q = require('q');
var extend = require('extend');
var socketioClient = require('socket.io-client');

var Client = function (options) {
  this.options = false;
  this.socket = false;
  this.setOptions(options);
  return this;
};

Client.prototype.CLIENT_DEFAULTS = {
  'server': 'http://localhost:3000',
  'forceNew': true
};

Client.prototype.setOptions = function (options) {
  if (typeof options !== 'object') {
    options = {};
  }
  if (typeof this.options !== 'object') {
    this.options = extend(true, this.CLIENT_DEFAULTS, options);
  } else {
    this.options = extend(true, this.options, options);
  }
};

Client.prototype.connect = function (options) {
  this.setOptions(options);
  var deferred = q.defer();
  this.socket = socketioClient(this.options.server, this.options);
  this.socket.on('connect_error', function(error) {
    deferred.reject(error);
  });
  this.socket.on('connect', function(data) {
    deferred.resolve();
  });
  return deferred.promise;
};

Client.prototype.newRoom = function (options) {
  this.setOptions(options);
  var roomName = String(Math.random());
  this.socket.on(roomName, function (data) {
    console.log('Room', roomName, 'received', data);
  });
  this.socket.emit('join', {
    room: roomName
  });
  return roomName;
};

module.exports = Client;
