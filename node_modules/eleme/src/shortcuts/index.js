var extend = require('../extend');
var shortcuts = require('./shortcuts');

var addShortcuts = function( eleme ) {

  extend( eleme, shortcuts, document.body );
  extend( HTMLElement.prototype, shortcuts );

  eleme.extend = extend;

  ['query','queryAll','prepend','append'].forEach(function(method) {
    eleme[method] = function( arg ) {
      return document.body[method]( arg );
    };
  });
};

module.exports = addShortcuts;