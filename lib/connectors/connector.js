'use strict';

var GSObject = require('game-stack-object'), Q = require('q');

var Connector = GSObject.extend({
  init: function(config) {
    this.$$config = config;
  },

  connect: function() {
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
  },

  find: function() {
    throw new Error('find method isn\'t implemented on connector', this.$$config.connector);
  },

  getStatus: function() {
    throw new Error('getStatus method isn\'t implemented on connector', this.$$config.connector);
  }
});

module.exports = Connector;
