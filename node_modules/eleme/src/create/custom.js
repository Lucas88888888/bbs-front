var createdElements = {};

var createCustomElement = function( args ) {

  var el, createEl;

  if ( createdElements[ args.name ] == null ) {

    createEl = document.registerElement( args.name, {
      prototype: Object.create( HTMLElement.prototype )
    });

    if ( args._registerOnly == null ) {
      // Find it in DOM or create new instance
      el = eleme.query( args.name );
      if ( ! el ) el = new createEl;
    }

    createdElements[ args.name ] = createEl;

  } else {

    el = new createdElements[ args.name ];
  }

  return el;
};

module.exports = createCustomElement;