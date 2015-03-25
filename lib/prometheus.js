'use strict';

var GSObject = require('game-stack-object'), Datastore = require('./datastore');

exports.register = function(server, options, next) {
  // Create the datastore
  var datastore = new Datastore(options);

  // Registering server method
  server.method([{
    name: 'prometheus.getDatastore',
    method: function() {
      return datastore;
    },
    options: {}
  }, {
    name: 'prometheus.getUser',
    method: function(username) {
      if (!options.auth || !options.auth.database || !options.auth.model) {
        throw new Error('Your prometheus configuration misses the auth options to perform authentication');
      }
      return datastore.getDatabase(options.auth.database)
        .from(options.auth.model)
        .findOne({filters: [{path: 'username', type: '=', value: username}]});
    },
    options: {}
  }]);

  // Connect the datastore
  datastore.connect().then(function() {
    next();
  }, function(err) {
    next(err);
  });
};

exports.register.attributes = {
  name: 'prometheus',
  version: '0.1.0'
};
