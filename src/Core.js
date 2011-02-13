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
  var list = ('' + namespace).split(/\./)
    , listLength = list.length
    , obj = []
    , context = window;

  if (!MOJO._namespace._provided) { 
    MOJO._namespace._provided = {};
  }

  for (var i = 0; i < listLength; i += 1) {
      var name = list[i];
      
      if (!context[name]) {
          obj[i] = name;
          context[name] = function() {};
          MOJO._namespace._provided[obj.join('.')] = context[name];
      }

      context = context[name];
  }
  return context;
};

MOJO.controllers = {};

MOJO.query = function() {
  return jQuery.apply(this, arguments);
};

MOJO.require = function(path, callback) {
  $.ajaxSetup({ async: false });
  $.getScript(path, function() {
    if (callback) callback.apply(this, arguments);
  });
  $.ajaxSetup({ async: true });
};

MOJO.define = function(className, implementation) {
  if (!MOJO.controllers) { 
    MOJO.controllers = {};
  }
  var controller = MOJO._namespace(className)
    , controller = implementation
    , abstractController = new Controller()
    , controller = $.extend(controller, abstractController);
    
    MOJO.controllers[className] = controller;

};

MOJO.create = function(options) {  
  if ( typeof window.Application == 'undefined' || !window.Application) {
    MOJO.require(options.mojoSrc + '/Application.js');
  } else {
    return new Application(options);
  }
};
