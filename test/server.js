var http = require('http');
var assert = require("assert");
var socketioClient = require('socket.io-client');

var sockroom = require('..');

var CLIENT_DEFAULTS = {
  'forceNew': true
};

describe('Server', function() {
  describe('#constructor()', function () {
    it('should attach to http server', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        httpServer.close();
        done();
      });
      httpServer.listen(0);
    });
    it('should allow client to connect', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        var url = 'http://localhost:' + httpServer.address().port;
        var client = socketioClient(url, CLIENT_DEFAULTS);
        client.on('connect', function (data) {
          client.emit('disconnect');
          httpServer.close();
          done();
        });
      });
      httpServer.listen(0);
    });
  });
  describe('#connect()', function () {
    it('should send client a name', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        var url = 'http://localhost:' + httpServer.address().port;
        var client = socketioClient(url, CLIENT_DEFAULTS);
        client.on('name', function (data) {
          client.emit('disconnect');
          httpServer.close();
          done();
        });
      });
      httpServer.listen(0);
    });
  });
  describe('#join()', function () {
    it('should send room created', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        var url = 'http://localhost:' + httpServer.address().port;
        var client = socketioClient(url, CLIENT_DEFAULTS);
        var roomName = 'someRoom';
        client.emit('join', {
          room: roomName
        });
        client.on('created', function (data) {
          if (data === roomName) {
            client.emit('disconnect');
            httpServer.close();
            done();
          }
        });
      });
      httpServer.listen(0);
    });
    it('should send messages to room members', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        var numClients = 5;
        var messagesRecevied = 0;
        // The last client will be used for sending so it will not receive
        var messagesNeeded = numClients - 1;
        var url = 'http://localhost:' + httpServer.address().port;
        var roomName = 'someRoom';
        var sendMessage = 'someMessage';
        var client;
        for (var i = 0; i < numClients; i++) {
          client = socketioClient(url, CLIENT_DEFAULTS);
          client.emit('join', {
            room: roomName
          });
          client.on(roomName, function (data) {
            if (data === sendMessage) {
              messagesRecevied++;
            }
            if (messagesRecevied >= messagesNeeded) {
              client.emit('disconnect');
              httpServer.close();
              done();
            }
          });
        }
        client.emit(roomName, sendMessage);
      });
      httpServer.listen(0);
    });
  });
});
