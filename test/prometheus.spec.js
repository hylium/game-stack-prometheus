'use strict';

var Prometheus = require('./../lib/prometheus'), assert = require('assert');

describe('Prometheus', function() {
  describe('#attributes', function() {
    it('should contain plugin name', function() {
      assert((new Prometheus()).attributes.name === 'prometheus');
    });
  });

  describe('#register', function() {

  });
});