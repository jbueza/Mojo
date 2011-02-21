(function(win, doc) {
  var MOJO = function() {};
  MOJO.controllers = {};
  MOJO.applications = {};
  
  MOJO._loaded = [];
  /* 
   * @private
   */
  MOJO._resolvedNamespace = function(namespace) {
      return MOJO._namespace._provided['' + namespace];
  };
  
  MOJO.resolve = function(name) {
    if (!MOJO._namespace._provided[name]) {
      return name.replace(/\./gi, '/');
    }
    
    return false;
  };
  /*
   * @private
   */
  MOJO._namespace = function(namespace) {
    var list = ('' + namespace).split(/\./)
      , listLength = list.length
      , obj = []
      , context = window || {};

    if (!MOJO._namespace._provided) MOJO._namespace._provided = {};
    
    if (MOJO._namespace._provided[namespace] == namespace) throw new Error (namespace + " has already been defined.");


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


  MOJO.query = function() {
    return jQuery.apply(this, arguments);
  };
  MOJO.queryFirst = function() {
    return MOJO.query.apply(this, arguments)[0];
  };

  
  MOJO.require = function(dependencies, callback) {
    if (!$.isArray(dependencies)) dependencies = [ dependencies ];
    var last = dependencies.length;
    
    for ( var i = 0; i < last; i++) {
      var dep = MOJO.resolve(dependencies[i]);

      console.log(dep);
    }

    if(callback) callback.call(this);
  };
  
  MOJO.fetch = function(path, callback) {
    //rename to fetch, as we're setting up require() for CommonJS AMD
//    $.ajaxSetup({ async: false });
    $.getScript(path, function() {
      if (callback) callback.apply(this, arguments);
    });
//   $.ajaxSetup({ async: true });
  };


  //should allow anonymous modules: define(dependencies, factory)
  //should allow id, dependencies, factory
  //shoulw allow id, factory
  MOJO.define = function define() {
    
    var args = arguments, len = args.length;
    
    for ( var i = 0; i < len; i++ ) { 
      if ( typeof args[i] == 'function' ) args[i] = args[i].call(this);
    }
    
    var controller;

    if (len > 2) {
      //resolve dependencies
      controller = args[2];
    } else if ( $.isArray(args[0] ) ) {
      //anonymous module

    } else if ( typeof args[1] == 'object' ) {
      //defined module
      //MOJO.define('Application', function())
      controller = args[1];
    }
    
    if(typeof args[0] == 'string') {
      MOJO._namespace(args[0]);
      MOJO.controllers[args[0]] = controller;
    }    
  };

  MOJO.create = function(options) {  
    return new Application(options);
  };

  window.MOJO = MOJO;
   
})(window, document);
