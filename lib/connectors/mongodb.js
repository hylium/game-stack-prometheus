'use strict';

var Connector = require('./connector');

var MongoDBConnector = Connector.extend({
  init: function(config) {
    this.$super(config);
  }
});

module.exports = MongoDBConnector;
