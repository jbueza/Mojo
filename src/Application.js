/*

var app = new MojoApplication({ locale: "en-US", mode: 'development', plugins: [
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
Application = function() {
  if(!this.options) this.options = {};
  this.options['appSrc'] = 'js';
  this.options['locale'] = 'en_CA';
  this.options['plugins'] = [];
  this.options['environment'] = 'dev';
  this.map = [];
  this.loaded = [];
};

Application.prototype.configure = function(key, value) {
  this.options[key] = value;
  console.log("Configure: ", key, " -> ", value);
  return this;
};

Application.prototype.get = function(selector, callback) {
  var self = this;
  var elements = $(selector);
  elements.each(function(index, item) {
    self.map.push({ context: item, init: callback });
  });
  
  return this;
};

Application.prototype.heal = function() {


  return this;
};

Application.prototype.mapControllers = function() {
  var self = this;
  $(self.map).each(function(index, context) {
    
    if (self.options.dev) try { console.log("Mapping: ", context); } catch (err) {}

    var silos = context.init.call(this);
    
    $(silos).each(function(i, silo) {

      if ($.inArray(silo.controller, self.loaded)) {
        $.getScript(self.options.appSrc + "/" +  (silo.controller.replace(/\./g, "\/") + ".js"), function(response) {
          console.log("Loaded");
          
          var controllerName = silo.controller;
          var controllerInstance = new MOJO.system.controllers[controllerName];
          controllerInstance.initialize(context.context, controllerName, silo.params);
          console.log(controllerInstance);
          $(context).data('controllers', controllerInstance);
        });
      } else {
        new Controller(context, silo.controller, silo.params);
      }
      
    });
  });

};


Application.prototype.start = function() {
  var self = this;
  $(document).ready(function() {
    self.mapControllers();
  });
  
};