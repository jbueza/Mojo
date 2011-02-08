var MOJO = function() {
  //return new MOJO();
  this.system = null;
  return this;
};

MOJO.define = function(className, abstractClass, implementation) {
  if (!MOJO.system || !MOJO.system.controllers) { 
    MOJO.system = {};
    MOJO.system.controllers = {};
  }
  var controller = MOJO.system.controllers[className] = new Function();
  controller = $.extend(controller, implementation);
  controller.prototype = new Function(abstractClass);
  
  return function() {
//    controller.apply(this,)
  }();
  
  
};

MOJO.create = function(options) {  
  if ( typeof window.Application == 'undefined' || !window.Application) {
    $.getScript(options.mojoSrc + '/Application.js');
  } else {
    return new Application();
  }
};
