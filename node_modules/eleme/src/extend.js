var extend = function( target, source, self ) {

  for ( var key in source ) {
    if ( source.hasOwnProperty(key) ) {
      if ( typeof source[key] === 'function' && self != null )
        target[key] = source[key].bind( self );
      else target[key] = source[key];
    }
  }

  return target;
};

module.exports = extend;