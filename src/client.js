var extend = require('extend');
var socketioClient = require('socket.io-client');

var CLIENT_DEFAULTS = {
  'server': 'http://localhost:3000'
};

var Client = function (options) {
  this.options = false;
  this.setOptions(options);
  return this;
}

Client.prototype.setOptions = function (options) {
  if (typeof options !== 'object') {
    options = {};
  }
  if (typeof this.options !== 'object') {
    this.options = extend(true, CLIENT_DEFAULTS, options);
  } else {
    this.options = extend(true, this.options, options);
  }
};

Client.prototype.connect = function (options) {
  this.setOptions(options);
  var deferred = Q.defer();
  var socket = socketioClient(this.options.server);
  socket.on('connect', function() {
    var newRoom = String(Math.random());
    socket.on(newRoom, function (data) {
      console.log('Got my', data);
    });
    socket.emit('event', {
      event: newRoom
    });
  });
};
