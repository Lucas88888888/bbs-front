var renderHTML = require('./html');

var renderSelf = function( html ) {
  renderHTML( this, html );
  return this;
};

module.exports = renderSelf;