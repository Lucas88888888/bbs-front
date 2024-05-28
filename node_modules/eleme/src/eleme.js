var createNativeElement = require('./create/native');
var createCustomElement = require('./create/custom');
var createCloneMethod = require('./instance/clone');
var initInstance = require('./instance/init');
var render = require('./instance/render');
var addShortcuts = require('./shortcuts');

var eleme = function( arg1, arg2 ) {

  var args = {};
  var el;

  if ( typeof arg1 === 'object' ) args = arg1;
  else if ( typeof arg1 === 'string' ) {
    if ( typeof arg2 === 'function' ) {
      args.name = arg1;
      args.init = arg2;
    } else {
      args = arg2 || {};
      args.name = arg1;
    }
  }

  if ( typeof args.name === 'undefined' )
    throw new Error('eleme needs a name');

  if ( args.name[0] === '#' || args.name[0] === '<' || args.name.indexOf('-') < 0 ) {
    el = createNativeElement( args );
  } else {
    el = createCustomElement( args );
  }

  args.render = render;
  args.clone = createCloneMethod( args );

  return initInstance( el, args );
};

addShortcuts( eleme );

module.exports = eleme;