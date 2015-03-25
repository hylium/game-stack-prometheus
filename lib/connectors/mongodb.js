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

  /**
   * Connect to the endpoint set in connector's options
   * @return {o.deferred.promise|*}
   */
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
  },

  /**
   * Finds one or more records with given query from the database.
   * @param {String} model
   * @param {Object} query
   * @return {*}
   */
  find: function(model, query) {
    var connector = this, queryObj = _.reduce(query.filters, function(obj, filter) {
      var condition = obj.where(filter.path)
      switch (filter.type) {
        case '=':
          return condition.equals(filter.value);
          break;
        default:
          throw new Error('Unknow operation', filter.type);
      }
    }, connector.$$models[model].find({}));

    return Q.Promise(function(resolve, reject) {
      queryObj.find(function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
});

module.exports = MongoDBConnector;
