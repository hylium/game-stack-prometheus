'use strict';

var Database = require('./../lib/database'), assert = require('assert'), conf = require('./config').connectorConf,
  _ = require('lodash');

describe('Database', function() {
  describe('#init', function() {
    it('should create a connector from config', function() {
      var database = new Database(_.merge({connector: 'mongodb'}, conf));
      assert(typeof database.$$connector === 'object');
    });
  });
});
