(function( $ ) {
  if (!mojo) mojo = {};

  mojo.Application = function Application() {
    this.options = arguments[0];
    this.initialize(this.options);
    return this;
  };

  mojo.Application.prototype.initialize = function(params) {

    return this;
  };

  mojo.Application.prototype.configure = function(key, value) {

    return this;
  };

  mojo.Application.prototype.use = function() {
    return this;
  };




  if(!window.mojo.Application) window.mojo.Application = mojo.Application;

  
})( jQuery );
