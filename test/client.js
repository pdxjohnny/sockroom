var http = require('http');
var assert = require("assert");
var socketio = require('socket.io');

var sockroom = require('..');

describe('Client', function() {
  describe('#setOptions()', function () {
    it('should return defaults when none given', function () {
      var client = new sockroom.Client();
      assert.deepEqual(client.options, client.CLIENT_DEFAULTS);
    });
    it('should incoperate new options when given', function () {
      var options = {
        'something': 'test'
      };
      var client = new sockroom.Client(options);
      assert(client.options.something);
    });
  });
  describe('#connect()', function () {
    it('should fail with no server', function (done) {
      var client = new sockroom.Client();
      client.connect()
      .then(done)
      .fail(function (error) {
        done();
      });
    });
    it('should succed on connection', function (done) {
      var server = http.createServer();
      socketio(server);
      server.on('listening', function() {
        var options = {
          'server': 'http://localhost:' + server.address().port
        };
        var client = new sockroom.Client(options);
        client.connect().then(function (error) {
          client.socket.emit('disconnect');
          server.close();
          done();
        }).fail(done);
      })
      server.listen(0);
    });
  });
});
