var assert = require("assert");
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
});
