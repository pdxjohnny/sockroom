var http = require('http');
var assert = require("assert");
var socketioClient = require('socket.io-client');

var sockroom = require('..');

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
        var client = socketioClient(url);
        client.on('connect', function (data) {
          httpServer.close();
          done();
        });
      });
      httpServer.listen(0);
    });
    it('should send client a name', function (done) {
      var httpServer = http.createServer();
      sockroom.Server(httpServer);
      httpServer.on('listening', function() {
        var url = 'http://localhost:' + httpServer.address().port;
        var client = socketioClient(url);
        client.on('name', function (data) {
          httpServer.close();
          done();
        });
      });
      httpServer.listen(0);
    });
    // it('should send client a name', function (done) {
    //   var httpServer = http.createServer();
    //   sockroom.Server(httpServer);
    //   httpServer.on('listening', function() {
    //     var options = {
    //       'server': 'http://localhost:' + httpServer.address().port
    //     };
    //     var client = new sockroom.Client(options);
    //     client.connect().then(function (error) {
    //       httpServer.close();
    //       done();
    //     }).fail(done);
    //   });
    //   httpServer.listen(0);
    // });
  });
});
