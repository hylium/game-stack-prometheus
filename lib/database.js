'use strict';

var GSObject = require('game-stack-object'), _ = require('lodash');

module.exports = GSObject.extend({
  init: function(config) {
    // Register database connector
    var Connector = _.isString(config.connector) ? require('./connectors/' + config.connector) : config.connector;
    this.connector = new Connector(config);
  },

  connect: function() {
    this.connector.connect();
  }
});
