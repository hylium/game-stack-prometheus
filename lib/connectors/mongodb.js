'use strict';

var Connector = require('./connector'), Mongoose = require('mongoose'), Q = require('q'), _ = require('lodash');

var MongoDBConnector = Connector.extend({
  init: function(config) {
    // Call Connector constructor
    this.$super(config);

    // Initialising
    this.$$models = {};

    // Registering event listeners
    var connector = this;
    this.$on('connectSuccess', function() {
      // Registering mongoose schemas
      config.models = config.models || {};
      _.forEach(config.models, function(model, key) {
        connector.$$models[key] = Mongoose.model(key, model);
      });
    });
  },

  connect: function() {
    // Constructing url parts
    var userPart = this.$$config.username ? this.$$config.username + ':' + this.$$config.password + '@' : '',
      hostPart = this.$$config.port ? this.$$config.hostname + ':' + this.$$config.port : this.$$config.hostname,
      url = 'mongodb://' + userPart + hostPart + '/' + this.$$config.dbName, connector = this;

    // Connecting
    var deferred = Q.defer();
    Mongoose.connect(url);
    this.$$connection = Mongoose.connection;

    // Connection events
    this.$$connection.on('error', function(err) {
      connector.$emit('connectError');
      deferred.reject(err);
    });
    this.$$connection.once('open', function() {
      connector.$emit('connectSuccess');
      deferred.resolve();
    });
    return deferred.promise;
  }
});

module.exports = MongoDBConnector;
