var iDOM = require("incremental-dom");
var parse = require("html-parse-stringify").parse;
var temp = document.createElement('div');

var decodeHTML = function( str ) {
  temp.innerHTML = str;
  return temp.innerHTML;
};

var renderAstNode = function( node ) {

  if ( node.type === 'text' )
    return iDOM.text( decodeHTML(node.content) );

  if ( node.type !== 'tag' ) return;

  var argsArray = [ node.name, null, null ];

  // Convert attributes object into flat array
  for (var attr in node.attrs) {
    argsArray.push( attr );
    argsArray.push( node.attrs[attr] );
  }

  if ( node.voidElement )
    return iDOM.elementVoid.apply( null, argsArray );

  iDOM.elementOpen.apply( null, argsArray );
  node.children.forEach( renderAstNode );
  iDOM.elementClose( node.name );
};

var renderHTML = function( el, html ) {

  if ( typeof html === 'undefined' ) return;

  // Wrap in single root element
  // to support HTML with single or multiple nodes
  html = '<div>' + html + '</div>';

  try {

    iDOM.patch( el, function() {

      var ast = parse( html );

      if ( ast[0] == null || ! Array.isArray(ast[0].children) ) return;
      // Unwrap
      ast[0].children.forEach(renderAstNode);
    });

  } catch (e) {}
};

module.exports = renderHTML;