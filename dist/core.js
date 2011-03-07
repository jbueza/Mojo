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
      , path
      , callbackIndex = 0; 
      
    var allocated = MOJO.controllers;
    for ( var i = 0; i < last; i++ ) {
      var dep = dependencies[i];
      path = MOJO.options.baseSrc + MOJO.resolve(dep) + ".js";
      MOJO._loaded.push(dep);
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
    $.getScript(path, function() {
      if (callback) callback.apply(this, arguments);
    });
  };

  //no more amd :(
  MOJO.define = function(id, factory) {    
    if ('function' == typeof factory) {
      factory = factory.call(this);
    }
    if(typeof id == 'string') {
      MOJO._namespace( id );
      MOJO._loaded[ id ] = factory;
      MOJO.controllers[ id ] = factory;
    }    
  };

  MOJO.create = function(options) {
    if (typeof options == 'undefined') {
      options = {};
      if (!options.baseSrc) options.baseSrc = 'js/';
      if (!options.mojoSrc) options.mojoSrc = '../src';
    }

    $.extend(this.options, options);
    return new Application();
  };

  MOJO.extend = function() {
    var F = function() {}; 
    return function(child, parent) {
    F.prototype = parent.prototype;	
      child.prototype = new F();	
      child.__super__ = parent.prototype;	
      child.prototype.constructor = child;
    };
  };
  
  
  window.MOJO = MOJO;
   
})(window, document);
/* 
 * Request 
 *
 * Class representation of a Controller Request instance. 
 * Encapsulates request-specific parameters, and context-specific 
 * information.
 *
 * @author Blast Radius (jbueza)
 */
MOJO.define('Request', function() {
  
function Request(paramsObj, callerObj, eventObj, controllerObj) {
  this.paramsObj = paramsObj;
  this.callerObj = callerObj;
  this.eventObj = eventObj;
  this.controllerObj = controllerObj;
};

/* 
 * Return the request's controller
 */
Request.prototype.getController = function() {
  return this.controllerObj;
};

/* 
 * Returns the context DOM element
 */
Request.prototype.getContextElement = function() {
  return this.getController().getContextElement();
};

/* 
 * Returns the object that invoked the request
 */

Request.prototype.getCaller = function() {
  return this.callerObj;
};

/* 
 * Returns an event object that was generated from the user interaction
 */

Request.prototype.getEvent = function() {
  return this.eventObj;
};

window.Request = Request;
return Request;
});MOJO.define('Controller', function() {  
/* 
 * Controller Class
 *
 * An abstract class used in implementing Mojo Controllers. A Controller is an 
 * object that encapsulates all event handling, dispatching and intercepting in 
 * a Mojo application.
 * 
 * @class       Controller
 * @author      Blast Radius (jbueza)
 * @constructor
 *
 */
function Controller() {
  this.contextElement = null;
  this.controllerClass = null;
  this.events;
};

Controller.prototype.onInit = function() {};
Controller.prototype.onParamChange = function() {};

Controller.prototype.initialize = function(context, controllerName, params) {
  var self = this;
  self.contextElement = context;
  self.controllerClass = controllerName;
  
  self.params = params;
  $(self.events).each(function(index, observer) {
    var root = $(document)
      , scope = observer[0]
      , selector = observer[1]
      , eventName = observer[2]
      , commandName = observer[3];
      
    if (scope == "context") root = $(context);    
    
    $(root).delegate(selector, eventName, function(evt) {
 
      var requestObj = new Request({}, this, evt, self);
      
      if (typeof self.before != 'undefined' && typeof self.before[commandName] != 'undefined') self.before[commandName].call(self, requestObj);
      self.methods[commandName].call(self, requestObj);
      if (typeof self.after != 'undefined' && typeof self.after[commandName] != 'undefined') self.after[commandName].call(self, requestObj);
    });
  });
  
  self.onInit();
};

/* 
 * @member  Controller
 * @return  {DOM} Context Element
 */
Controller.prototype.getContextElement = function() {
  if (!this.contextElement) return null;
  return this.contextElement;
};

/* 
 * Provides the capability to set params on controllers: (key, value) or get (key)
 * @member Controller
 */
 
Controller.prototype.param = function(key, value) {
  if (arguments.length > 1) {
    this.params[key] = value;
    this.onParamChange();
    return this;
  } else {
    return this.params[key];
  }
};
window.Controller = Controller;
return Controller;
});
MOJO.define('Application', function() {
/*
 * Application Class
 *
 * Class representation of your application where you're provided
 * with the capability to inject plugins, as well as, handle
 * dependencies. Also maps all controllers to DOM elements.
 * 
 * @author    Blast Radius (jbueza)
 */
function Application() {
  if (!this.options) this.options = {};
  
  var self = this, localOptions = self.options;
    localOptions['locale'] = 'en_CA';
    localOptions['plugins'] = [];
    localOptions['pluginSrc'] = 'js/lib/plugins/';
    localOptions['environment'] = 'dev';
    localOptions['selector'] = jQuery || (function() { throw new Error('Unable to find jQuery'); }) ();
    self.siteMap = [];
};
/* 
 * Triggered when application is fully bootstrapped
 */
Application.prototype.onComplete = function() {};

Application.prototype.configure = function(key, value) {
  if (arguments.length > 1) {
    this.options[key] = value;
    if (this.options.environment == 'dev') try { console.info("Configure: ", key, " -> ", value); } catch(err) {}
    return this;
  } else {
    return this.options[key];
  }
};

Application.prototype.map = function(selector, callback) {
  var self = this;
  var elements = $(selector);
  elements.each(function(index, item) {
    self.siteMap.push({ context: item, init: callback });
  });
  callback.call(this, self);
  return this;
};

Application.prototype.heal = function() {
  //will self heal all dependencies
  return this;
};
Application.prototype.setupController = function(context, controller, params) {
  var sizzleContext = $(context);
  
  var controllerObj = MOJO.controllers[controller]
    , abstractController = new Controller()
    , controllerObj = $.extend(controllerObj, abstractController);
  MOJO.controllers[controller] = controllerObj;
  
  if ( typeof controllerObj == 'undefined') throw new Error("Undefined Controller @ ", controller);
  controllerObj.initialize(context, controller, params);
  if (typeof controllerObj.after != 'undefined' && controllerObj.after['Start'] != 'undefined') controllerObj.after['Start'].call(controllerObj, null);
};

Application.prototype.disconnectControllers = function(callback) {
  var self = this;
  
  $(self.siteMap).each(function(index, silo) {
    $(silo.context).unbind().undelegate();
  });
  
  callback.apply(self);
};
Application.prototype.connectControllers = function() {
  var self = this
    , controllers2load = [];
    
  $(self.siteMap).each(function(index, mapping) {
    var silos = mapping.init.call(this);
    
    $(silos).each(function(i, silo) {
      if (!MOJO.controllers.hasOwnProperty(silo.controller)) { 
        controllers2load.push(silo.controller);
      } else {
        MOJO._loaded[silo.controller] = silo.controller;
      }
    });
  });
  
  MOJO.require($.unique(controllers2load), function() {
    $(self.siteMap).each(function(index, mapping) {
      if (self.options.environment == 'dev') try { console.log("Mapping: ", mapping.context); } catch (err) {}
      var silos = mapping.init.call(this);
      $(silos).each(function(i, silo) {
        self.setupController(mapping.context, silo.controller, silo.params);
      });
    });      
  });
};
Application.prototype.on = function(eventName, callback) {
  return function() {
  };
};

Application.prototype.getPlugins = function(callback) {
   var self = this, path = self.options.pluginSrc;
   $(self.options.plugins).each(function(index, plugin) {
     MOJO.fetch(path + plugin + ".js");
   });
   callback.call(self);
};

Application.prototype.start = function() {
  var self = this;
  $(document).ready(function() {
    self.disconnectControllers(function() {
      if (self.options.plugins.length) { 
        self.getPlugins(function() {
          self.connectControllers();
        });
      } else {
        self.connectControllers();
      }
      self.onComplete();
    });
  });
  
};

  window.Application = Application;
  return Application;
});
