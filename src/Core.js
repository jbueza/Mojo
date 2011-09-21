(function(win, doc) {
  
  "use strict";
  
  var $ = jQuery;

  var mojo = function() {};
  mojo.controllers = {};
  mojo.applications = {};
  mojo.options = {};
  mojo._loaded = [];
  
  mojo.resolve = function(name) {
    if (!mojo._namespace._provided[name]) {
      return name.replace(/\./gi, '/');
    }
    
    return false;
  };
  /*
   * @private
   */
  mojo._namespace = function(namespace) {
    var list = ('' + namespace).split(/\./)
      , listLength = list.length
      , obj = []
      , context = window || {};

    if (!mojo._namespace._provided) mojo._namespace._provided = {};
    
    if (mojo._namespace._provided[namespace] == namespace) throw new Error (namespace + " has already been defined.");


    for (var i = 0; i < listLength; i += 1) {
      var name = list[i];

      if (!context[ name ]) {
        obj[i] = name;
        context[name] = function() {};
        mojo._namespace._provided[obj.join('.')] = context[ name ];
      }
      context = context[ name ];
    }
    return context;
  };

  mojo.template =function(template, data, partials) {
    if ('undefined' == typeof Mustache) return false;
    if ('undefined' == typeof template || !template) throw new Error("'template' is required");
    if ('undefined' == typeof data || !data) throw new Error("'data' is required");
  
    return Mustache.to_html(template, data, partials);
  };
  /* 
   * Returns an array of DOM nodes
   */
  mojo.query = function() {
    return $.apply(this, arguments);
  };
  /* 
   * Returns the first element in a node list
   */
  mojo.queryFirst = function() {
    return mojo.query.apply(this, arguments)[0];
  };

  /* 
   * Fetch an array of dependencies, then fire a callback when done
   * @param dependencies {Array}
   * @param callback {Function}
   */
  mojo.require = function(dependencies, callback) {
    if ('undefined' == typeof dependencies || !dependencies) throw new Error("'dependencies' is required");
    if ('undefined' == typeof callback || !callback) throw new Error("'callback' is required");
    
    if (!$.isArray(dependencies)) dependencies = [ dependencies ];
    
    var last = dependencies.length
      , path
      , callbackIndex = 0; 
      
    var allocated = mojo.controllers;
    for ( var i = 0; i < last; i++ ) {
      var dep = dependencies[i];
      path = mojo.options.baseSrc + mojo.resolve(dep) + ".js";
      mojo._loaded.push(dep);
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
   * Synchronously load a module
   */
  mojo.requireSync = function(name) {
    var path = mojo.options.baseSrc + mojo.resolve(name) + ".js";
    $.ajaxSetup({async: false});
    $.getScript(path);
    $.ajaxSetup({async: true});
  };

  /* 
   * Retrieves a plugin
   * @param path {String} The location of the module on the file system
   * @param callback {Function} A callback to be executed when the plugin has completed loading
   * @deprecated 
   */
  mojo.fetch = function(path, callback) {
    $.getScript(path, function() {
      if (callback) callback.apply(this, arguments);
    });
  };

  mojo.define = function(id, factory) { 
    if ('undefined' == typeof id || !id) throw new Error("'id' is required");
    if ('undefined' == typeof factory || !factory) throw new Error(id + " missing factory implementation");
    if ('function' == typeof factory) {
      factory = factory.call(this);
    }
    if('string' == typeof id) {
      mojo._namespace( id );
      mojo._loaded[ id ] = factory;
      mojo.controllers[ id ] = factory;
    }    
  };

  /* 
   * Creates an mojo application instance. One web site can contain multiple mojo applications.
   * @param options {Object} A set of default options for particular mojo application
   */
  mojo.create = function(options) {
    
    if ('undefined' == typeof options) {
      options = {};
      if (!options.baseSrc) options.baseSrc = 'js/';
    }
    $.extend(this.options, options);
    return new mojo.Application();
  };
  
  window.mojo = mojo;
   
})(window, document);
