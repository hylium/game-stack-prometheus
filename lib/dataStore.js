'use strict';

var GSObject = require('game-stack-object'), _ = require('lodash'), Database = require('./database'), Q = require('q');

module.exports = GSObject.extend({
  init: function(config) {
    // Default config
    config = _.merge({
      databases: {}
    }, config);

    // Create databases
    this.$$databases = _.mapValues(config.databases, function(databaseConf) {
      return new Database(databaseConf);
    });
  },

  connect: function() {
    var promises = _.map(this.$$databases, function(database) {
      return database.connect();
    });
    return Q.all(promises);
  },

  getDatabase: function(key) {
    return this.$$databases[key];
  }
});
