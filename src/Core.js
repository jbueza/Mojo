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
  MOJO.system.controllers[className] = new Function();
  MOJO.system.controllers[className].prototype = new Controller;
  MOJO.system.controllers[className].events = implementation.events;
   
};

MOJO.create = function(options) {  
  if ( typeof window.Application == 'undefined' || !window.Application) {
    $.getScript(options.mojoSrc + '/Application.js');
  } else {
    return new Application();
  }
};
