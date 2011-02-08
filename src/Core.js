var MOJO = function() {
  this.options = null;
  this.locale = null;
};
MOJO.prototype.spawn = function() {
  return new MOJO_Application();
};
