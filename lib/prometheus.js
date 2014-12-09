'use strict';

var GSObject = require('game-stack-object');

module.exports = GSObject.extend({
  init: function() {

  },

  register: function(plugin, options, next) {
    next();
  },

  attributes: {
    name: 'prometheus'
  }
});
