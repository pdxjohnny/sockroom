var http = require('http');
var assert = require("assert");
var socketio = require('socket.io');

var Client = require('..').Client;

describe('Client', function() {
  describe('#setOptions()', function () {
    it('should return defaults when none given', function () {
      var client = new Client();
      assert.deepEqual(client.options, client.CLIENT_DEFAULTS);
    });
    it('should incoperate new options when given', function () {
      var options = {
        'something': 'test'
      };
      var client = new Client(options);
      assert(client.options.something);
    });
  });
  describe('#connect()', function () {
    it('should fail with no server', function (done) {
      var client = new Client();
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
        var client = new Client(options);
        client.connect().then(function (error) {
          server.close();
          done();
        }).fail(done);
      })
      server.listen(0);
    });
  });
});
