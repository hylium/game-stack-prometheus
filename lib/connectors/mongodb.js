'use strict';

var Connector = require('./connector'), Mongoose = require('mongoose'), Q = require('q'), _ = require('lodash');

var MongoDBConnector = Connector.extend({
  init: function(config) {
    var connector = this;

    // Call Connector constructor
    this.$super(config);

    // Registering event listeners
    this.$$models = {};
    var listener = this.$on('connected', function() {
      // Registering mongoose schemas
      config.models = config.models || {};
      _.forEach(config.models, function(model, key) {
        connector.$$models[key] = Mongoose.model(key, model);
      });

      listener.$dismiss();
    });
  },

  /**
   * Return the mongodb url generated from stored config
   * @return {String}
   */
  getUrl: function() {
    var userPart = this.$$config.username ? this.$$config.username + ':' + this.$$config.password + '@' : '',
      hostPart = this.$$config.port ? this.$$config.hostname + ':' + this.$$config.port : this.$$config.hostname;
    return 'mongodb://' + userPart + hostPart + '/' + this.$$config.dbName;
  },

  /**
   * Connect to the endpoint set in connector's options
   * @return {o.deferred.promise|*}
   */
  connect: function() {
    // Constructing url parts
    var url = this.getUrl(), connector = this;

    // Connecting
    var deferred = Q.defer();
    Mongoose.connect(url);
    this.$$connection = Mongoose.connection;

    // Connection events
    var errorCallback = function(err) {
      connector.$emit('error');
      deferred.reject(err);
    };
    this.$$connection.once('error', errorCallback);
    this.$$connection.once('open', function() {
      connector.$$connection.removeListener('error', errorCallback).on('error', function() {
        connector.$emit('disconnected');
      });
      connector.$emit('connected');
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
      var condition = obj.where(filter.path);
      switch (filter.type) {
        case '=':
          return condition.equals(filter.value);
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
  },

  /**
   * Retrieve connector status
   * @return {Object}
   */
  getStatus: function() {
    return {
      name: this.$$config.connector,
      host: this.getUrl()
    };
  }
});

module.exports = MongoDBConnector;
