/*!
 * The Blast Mojo Framework
 *
 * Copyright (c) 2011 Blast Radius
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
MOJO.define('Request', ['Controller'], function() {
/* 
 * Request 
 *
 * Class representation of a Controller Request instance. 
 * Encapsulates request-specific parameters, and context-specific 
 * information.
 *
 * @author Blast Radius (jbueza)
 */
function Request(paramsObj, callerObj, eventObj, controllerObj) {
  this.paramsObj = paramsObj;
  this.callerObj = callerObj;
  this.eventObj = eventObj;
  this.controllerObj = controllerObj;
};


Request.prototype.getController = function() {
  return this.controllerObj;
};

Request.prototype.getContextElement = function() {
  return this.getController().getContextElement();
};

Request.prototype.getCaller = function() {
  return this.callerObj;
};

Request.prototype.getEvent = function() {
  return this.eventObj;
};
window.Request = Request;
return Request;
});MOJO.define('Controller', ['Request'], function() {  
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
MOJO.define('Application', ['Controller'], function() {
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
    try { console.info("Configure: ", key, " -> ", value); } catch(err) {}
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
    
  // HEAL ME BRO!!!!
  $(self.siteMap).each(function(index, mapping) {
    var silos = mapping.init.call(this);
    $(silos).each(function(i, silo) {
      if (!MOJO._loaded.length || $.inArray(silo.controller, MOJO._loaded) == -1) { 
        controllers2load.push(silo.controller);
      } else {
        MOJO._loaded.push(silo.controller);
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
MOJO.define('Service', [], function() {
/* 
  @author       Jaime Bueza
  @description  Class representation of a web service call
  @dependencies jQuery
    
*/
function Service(name, uri, options) {
  
  var defaults = { 
      method: options.method || function() {
        var type = "get";
          if (name.match(/^get/i)) {
            type = "get";
          } else if (name.match(/^add|del|update/i)) {
            type = "post";
          }
          return type;
      }()
    , template: false };
  this.name = name;
  this.uri = uri;
  this.options = $.extend({}, defaults, options);
  console.log(this.options);
};

Service.prototype.invoke = function(params, callback, scope) {

  var self = this;
  var options = this.getOptions() || {}
    , method = options.method
    , uri = this.uri
    , responseType = options.responseType || 'JSON';
  if (options.template) {
    uri = $.tmpl(uri, params);
    params = null;
  }
  
  $.ajaxSetup({
      dataTypeString: responseType
    , type: method
    , cache: options.cache || 'false'
    , contentType: "application/json; charset=utf-8"
  });

  $.ajax({ url: uri, data: params })
    .success(function(data) { 
      if ( responseType == 'JSON' ) { 
        data = $.parseJSON(data); 
      }
        
      if ( typeof callback == 'function' ) {
        callback.call(scope, null, data);
      } else {
        //string
        scope[callback](null, data);
      }        
    })
    .error(function() {
      callback.call(scope, "Unable to execute XHR", arguments);
    });


};

Service.prototype.getName = function() {
  return this.name;
};
Service.prototype.getURI = function() {
  return this.uri;
};
Service.prototype.getOptions = function() {
  return this.options;
};

window.Service = Service;
return Service;

});
MOJO.define('ServiceLocator', [], function() {
/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
                  http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 */
var ServiceLocator = {
  services: {},
  addService: function(service) {
    this.services[service.name] = service;
    return this;
  },
  getService: function(name) {
    return this.services[name];
  },
  removeService: function(name) {
    delete this.services[name];
  },
  removeServices: function() { 
    this.services = {}; 
  }
};
  window.ServiceLocator = ServiceLocator;
  return ServiceLocator;

});