var shortcuts = {

  emit: function (t, a) {
    var e = document.createEvent('Event');
    e.initEvent(t, 1, 1);
    e.detail = a;
    this.dispatchEvent(e);
  },

  on: function () {
    this.addEventListener.apply(this, arguments);
    return this;
  },

  off: function () {
    this.removeEventListener.apply(this, arguments);
    return this;
  },

  once: function (t, h, c) {
    var f = function(){
      this.off(t, f, !!c);
      h.apply(this, arguments);
    };
    return this.on(t, f, !!c);
  }
};

module.exports = shortcuts;