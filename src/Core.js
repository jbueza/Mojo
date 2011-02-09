var MOJO = function() {
  //return new MOJO();
  this.system = null;
  return this;
};

MOJO._loaded = [];
MOJO._set = function(parts) {
  
};
MOJO._resolvedNamespace = function(namespace) {
    return MOJO._namespace._provided['' + namespace];
};
MOJO._namespace = function(namespace) {
  var list = ('' + namespace).split(/\./),
      sb = [],
      context = window;

  if (!MOJO._namespace._provided) { 
    MOJO._namespace._provided = {};
  }

  for (var i = 0; i < list.length; i += 1) {
      var name = list[i];
      
      if (! context[name]) {
          sb[i] = name;
          context[name] = function() {};
          MOJO._namespace._provided[sb.join('.')] = context[name];
      }

      context = context[name];
  }
  return context;
};
MOJO.controllers = {};
MOJO.define = function(className, abstractClass, implementation) {
  if (!MOJO.controllers) { 
    MOJO.controllers = {};
  }
  var controller = MOJO._namespace(className)
    , controller = implementation
    , abstractController = new Controller()
    , controller = $.extend(controller, abstractController);
    
    MOJO.controllers[className] = controller;
    MOJO._loaded.push(className);

};

MOJO.create = function(options) {  
  if ( typeof window.Application == 'undefined' || !window.Application) {
    $.getScript(options.mojoSrc + '/Application.js');
  } else {
    return new Application();
  }
};
