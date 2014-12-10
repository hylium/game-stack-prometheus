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
  }
});

module.exports = Connector;
