'use strict';

var Connector = require('./../../lib/connectors/connector'), assert = require('assert');

describe('Connector', function() {
  describe('#init', function() {
    it('should save config into itself', function() {
      var connector = new Connector({test: 123});
      assert(connector.config.test === 123);
    });
  });
});
