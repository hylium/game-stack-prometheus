'use strict';

module.exports = {
  register: function(hyperion, plugin, options, next) {
    next();
  },

  attributes: {
    name: 'prometheus'
  }
};
