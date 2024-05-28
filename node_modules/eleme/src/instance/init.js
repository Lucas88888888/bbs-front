var extend = require('../extend');

var initInstance = function( self, args ) {

  extend( self, args, self );

  if (self.init) self.init.apply(self);

  return self;
};

module.exports = initInstance;