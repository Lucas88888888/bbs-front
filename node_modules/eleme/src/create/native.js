var createCustomElement = require('./custom');
var temp = document.createElement('div');

var createNativeElement = function( args ) {

  var el, parts;

  if ( args.name[0] === '#' ) {

    el = document.body.query( args.name );

  } else if ( args.name[0] === '<' ) {

    // If it's a custom element, make sure it's registered
    parts = args.name.split(/[\s>]+/);
    parts[0] = parts[0].substr(1);
    if ( parts[0].indexOf('-') >= 0 ) {
      createCustomElement({
        name: parts[0],
        _registerOnly: true
      });
    }

    temp.innerHTML = args.name;
    el = temp.children[0];

  } else if ( args.name instanceof HTMLElement ) {

    el = args.name;

  } else {

    el = document.createElement( args.name );
  }

  return el;
};

module.exports = createNativeElement;