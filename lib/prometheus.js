'use strict';

var Datastore = require('./datastore'), _ = require('lodash');

exports.register = function(server, options, next) {
  // Create the datastore
  var datastore = new Datastore(options);

  // Registering server method
  server.method([{
    name: 'prometheus.getDatastore',
    method: function() {
      return datastore;
    }
  }, {
    name: 'prometheus.getUser',
    method: function(username) {
      if (!options.auth || !options.auth.database || !options.auth.model) {
        throw new Error('Your prometheus configuration misses the auth options to perform authentication');
      }
      return datastore.getDatabase(options.auth.database)
        .from(options.auth.model)
        .findOne({filters: [{path: 'username', type: '=', value: username}]});
    }
  }, {
    name: 'prometheus.data',
    method: function() {
      return {
        databases: _.map(datastore.$$databases, function(database, dbName) {
          return {
            name: dbName,
            connector: database.$$connector.getStatus()
          };
        })
      };
    }
  }, {
    name: 'prometheus.start',
    method: function() {
      return datastore.connect();
    }
  }]);

  // Connect the datastore
  datastore.onNotification(function(data) {
    server.methods.hyperion.log(data.level, data.args.message);
  });

  next();
};

exports.register.attributes = {
  name: 'prometheus',
  version: '0.1.0'
};
