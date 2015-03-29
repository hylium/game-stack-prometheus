'use strict';

var Prometheus = require('./../lib/prometheus'), assert = require('assert'), conf = require('./config');

describe('Prometheus', function() {
  describe('#attributes', function() {
    it('should contain plugin name', function() {
      assert(Prometheus.register.attributes.name === 'prometheus');
    });
  });

  describe('#register', function() {

  });
});
