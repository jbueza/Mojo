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
  .get('.reuseable-carousel')
  .bind('CarouselBinder');
  
  
  
*/


/* */

//Taking a new approach to bindings
/*
var app = MOJO.spawn(); //spawn a new mojo application instance

app
  .configure({ env: 'node|web|mobile', locale: 'en_US', plugins: [ 'jcarousel', 'pubsub', 'jqmodal' ]})
app
  .get('#login-panel')
  .map('mysite.user.LoginController')
  
  .get('#registration')
  .map('mysite.user.RegistrationController')
  
  .get('.carousel')
  .map('mysite.interface.CarouselController')
  
*/
define(function() {
  var options = {};
  
  
  return {
    configure: function(options) {

    }
  };
});

