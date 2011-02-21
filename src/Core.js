(function(win, doc) {
  var MOJO = function() {};
  MOJO.controllers = {};
  MOJO.applications = {};
  MOJO.options = {};
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

      if (!context[ name ]) {
        obj[i] = name;
        context[name] = function() {};
        MOJO._namespace._provided[obj.join('.')] = context[ name ];
      }
      context = context[ name ];
    }
    return context;
  };
  /* 
   * Returns an array of DOM nodes
   */
  MOJO.query = function() {
    return jQuery.apply(this, arguments);
  };
  /* 
   * Returns the first element in a node list
   */
  MOJO.queryFirst = function() {
    return MOJO.query.apply(this, arguments)[0];
  };
  
  /* 
   * Fetch an array of dependencies, then fire a callback when done
   * @param dependencies {Array}
   * @param callback {Function}
   */
  MOJO.require = function(dependencies, callback) {
    if (!$.isArray(dependencies)) dependencies = [ dependencies ];
    var last = dependencies.length
      , path = MOJO.options.baseSrc
      , callbackIndex = 0; 
            
    for ( var i = 0; i < last; i++ ) {
      var dep = dependencies[i];
      var path = MOJO.options.baseSrc + MOJO.resolve(dep) + ".js";
      MOJO._loaded.push(dependencies[i]);
      
      $.getScript(path, function() {
        //these are all loaded asynchronously
        callbackIndex++;  //callback counter so we can invoke a resolution event
                          //at the end of loading all dependencies
      });
    }

    var interval = setInterval(function() {
      if(callback && callbackIndex == last) { 
        clearInterval(interval);
        callback.call(this);
      }
    }, 25);
    
  };
  /* 
   * @deprecated - Should be used as require() instead
   */
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
      controller = args[1];
    }
    
    if(typeof args[0] == 'string') {
      MOJO._namespace(args[0]);
      MOJO.controllers[args[0]] = controller;
    }    
  };

  MOJO.create = function(options) {  
    $.extend(this.options, options);
    return new Application();
  };

  window.MOJO = MOJO;
   
})(window, document);
