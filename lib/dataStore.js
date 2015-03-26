'use strict';

var GSObject = require('game-stack-object'), _ = require('lodash'), Database = require('./database'), Q = require('q');

module.exports = GSObject.extend({
  init: function(config) {
    var datastore = this;

    // Default config
    config = _.merge({
      databases: {}
    }, config);

    // Create databases
    this.$$databases = _.mapValues(config.databases, function(databaseConf, dbName) {
      var db = new Database(databaseConf);
      return db.onConnect(function() {
        datastore.notify('connected', 'info', {message: dbName + ' connected'});
      }).onDisconnect(function() {
        datastore.notify('disconnected', 'warn', {message: dbName + ' disconnected'});
      });
    });
  },

  connect: function() {
    var promises = _.map(this.$$databases, function(database) {
      return database.connect();
    });
    return Q.all(promises);
  },

  notify: function(event, level, args) {
    this.$emit('notif', {event: event, level: level, args: args});
  },

  onNotification: function(callback) {
    this.$on('notif', callback);
    return this;
  },

  getDatabase: function(key) {
    return this.$$databases[key];
  }
});
