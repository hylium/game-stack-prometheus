'use strict';

var Datastore = require('./datastore'), _ = require('lodash');

exports.register = function(server, options, next) {
  // Create the datastore
  var datastore = new Datastore(options);

  function getPrometheusData() {
    return {
      databases: _.map(datastore.$$databases, function(database, dbName) {
        return {
          name: dbName,
          connector: database.$$connector.getStatus()
        };
      })
    };
  }

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
    method: getPrometheusData
  }, {
    name: 'prometheus.start',
    method: function() {
      return datastore.connect().then(function() {
        var data = getPrometheusData();
        server.methods.hyperion.log('info', 'Prometheus databases :'.yellow);
        _.each(data.databases, function(database, i) {
          var isLast = i === data.databases.length - 1;
          server.methods.hyperion.log(
            'info',
            '  %s (%s) : %s [ %s ]%s',
            database.name,
            database.connector.online ? 'online'.green : 'offline'.red,
            database.connector.host,
            database.connector.name.cyan, isLast ? '\n' : ''
          );
        });
      });
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
