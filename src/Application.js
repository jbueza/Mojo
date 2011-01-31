/*

var app = new Mojo.Application({ locale: "en-US", mode: 'development', plugins: [
    'jqCarousel', 'pubsub', 'servicelocator', 'jqModal', 'bbq', 'tmpl'
  ] });

app
  .map('#login-panel', function(params) {
  //callback upon instantiation that passes params into controller(s)
    return {

    }
  })
  .validate({ 'username': [ 'isRequired' ], 'password': [ 'isRequired' ])
  .bind('LoginController');
  
app
  .map('.reuseable-carousel')
  .bind('CarouselBinder');
  
  
  
*/
(function( $ ) {
  if (!mojo) mojo = {};

  mojo.Application = function() {
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
})( jQuery );
