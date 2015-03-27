'use strict';

var GSObject = require('game-stack-object'), _ = require('lodash');

function Query(model, connector) {
  this.model = model;
  this.connector = connector;
}

Query.prototype = {
  find: function(query) {
    return this.connector.find(this.model, query);
  },
  findOne: function(query) {
    return this.connector.find(this.model, query).then(function(results) {
      return results[0];
    });
  }
};

module.exports = GSObject.extend({
  init: function(config) {
    // Register database $$connector
    var Connector = _.isString(config.connector) ? require('./connectors/' + config.connector) : config.connector;
    this.$$connector = new Connector(config);
  },

  connect: function() {
    return this.$$connector.connect();
  },

  onConnect: function(callback) {
    this.$$connector.$on('connected', callback);
    return this;
  },

  onDisconnect: function(callback) {
    this.$$connector.$on('disconnected', callback);
    return this;
  },

  onError: function(callback) {
    this.$$connector.$on('error', callback);
    return this;
  },

  /**
   * Returns a query object specific to a given model.
   * @param {String} model
   * @return {Query}
   */
  from: function(model) {
    return new Query(model, this.$$connector);
  }
});
