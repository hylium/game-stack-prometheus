'use strict';

var DataStore = require('./../lib/dataStore'), assert = require('assert'), _ = require('lodash'),
  conf = require('./config').connectorConf;

describe('DataStore', function() {
  describe('#init', function() {
    it('should register each database in config', function() {
      var dataStore = new DataStore({
        databases: {test: _.merge({connector: 'mongodb'}, conf)}
      });
      assert(dataStore.databases.test);
    });
  });

  describe('#connect', function() {
    it('should connect all databases', function(done) {
      var dataStore = new DataStore({
        databases: {test: _.merge(conf, {connector: 'mongodb'})}
      });
      dataStore.connect().then(function() {
        assert(true);
        done();
      }, function() {
        assert(false);
        done();
      });
    });

    it('should throw if a connection fails', function(done) {
      var dataStore = new DataStore({
        databases: {test2: _.merge(conf, {connector: 'mongodb', hostname: 'invalid host name'})}
      });
      dataStore.connect().then(function() {
        done(new Error('This should have failed'));
      }, function() {
        done();
      });
    });
  });
});
