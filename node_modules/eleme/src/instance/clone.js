var initInstance = require('./init');

var createCloneMethod = function( args ) {

  return function clone( deep ) {

    var newEl = document.createElement( this.tagName );

    if ( deep ) newEl.innerHTML = this.innerHTML;

    initInstance( newEl, args );

    return newEl;
  };
};

module.exports = createCloneMethod;