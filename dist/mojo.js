(function(win, doc) {
  
  "use strict";
  
  var MOJO = function() {};
  MOJO.controllers = {};
  MOJO.applications = {};
  MOJO.options = {};
  MOJO._loaded = [];
  
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
    if ('undefined' == typeof dependencies || !dependencies) throw new Error("'dependencies' is required");
    if ('undefined' == typeof callback || !callback) throw new Error("'callback' is required");
    
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
  
  MOJO.fetch = function(path, callback) {
    $.getScript(path, function() {
      if (callback) callback.apply(this, arguments);
    });
  };

  MOJO.define = function(id, factory) { 
    if ('undefined' == typeof id || !id) throw new Error("'id' is required");
    if ('undefined' == typeof factory || !factory) throw new Error(id + " missing factory implementation");
    if ('function' == typeof factory) {
      factory = factory.call(this);
    }
    if('string' == typeof id) {
      if ( MOJO.controllers.hasOwnProperty(id) ) {
        try { console.log("Multiple definitions found for: ", id); } catch (err) {}
      }
      MOJO._namespace( id );
      MOJO._loaded[ id ] = factory;
      MOJO.controllers[ id ] = factory;
    }    
  };

  MOJO.create = function(options) {
    
    if ('undefined' == typeof options) {
      options = {};
      if (!options.baseSrc) options.baseSrc = 'js/';
    }
    $.extend(this.options, options);
    return new Application();
  };
  
  window.MOJO = MOJO;
   
})(window, document);
MOJO.define('MOJO.Messaging', function() {
"use strict";
var storage = $({});
var Messaging = function() {};

Messaging.subscribe = function() {
  storage.bind.apply( storage, arguments );
};

Messaging.unsubscribe = function() {
  storage.unbind.apply( storage, arguments );
};

Messaging.publish = function() {
  storage.trigger.apply( storage, arguments );
};


('undefined' == typeof window) ? process.MOJO.Messaging = Messaging : window.MOJO.Messaging = Messaging;
window.MOJO.Messaging = Messaging;
return Messaging;

  
  
  
});/* 
 * Request 
 *
 * Class representation of a Controller Request instance. 
 * Encapsulates request-specific parameters, and context-specific 
 * information.
 *
 * @author Blast Radius
 */
MOJO.define('Request', function() {

"use strict"; 

function Request(paramsObj, callerObj, eventObj, controllerObj) {
  if ('undefined' == typeof paramsObj || !paramsObj) throw new Error("'paramsObj' is required");
  if ('undefined' == typeof callerObj || !callerObj) throw new Error("'callerObj' is required");
  if ('undefined' == typeof eventObj || !eventObj) throw new Error("'eventObj' is required");
  if ('undefined' == typeof controllerObj || !controllerObj) throw new Error("'controllerObj' is required");
  
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
});/* 
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
MOJO.define('Controller', function() {  

"use strict";

function Controller() {
  this.contextElement = null;
  this.controllerClass = null;
  this.events;
};

Controller.prototype.onInit = function() {};
Controller.prototype.onParamChange = function() {};


Controller.prototype.params = {};

Controller.prototype.initialize = function(context, controllerName, params) {
  var self = this;

  self.contextElement = context;
  self.controllerClass = controllerName;
  
  if ('undefined' != typeof params || !params) self.params = params;

  $(self.events).each(function(index, observer) {
    var root = $(document)
      , scope = observer[0]
      , selector = observer[1]
      , eventName = observer[2]
      , commandName = observer[3];

    if (scope == "context") root = $(context);
    
    $(root).delegate(selector, eventName, function(evt) {
 
      var requestObj = new Request($(this).data() || {}, this, evt, self);

      if (typeof self.before != 'undefined' && typeof self.before[commandName] != 'undefined') self.before[commandName].call(self, requestObj);
      self.methods[commandName].call(MOJO.controllers[controllerName], requestObj);
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
  if ('undefined' == typeof this.params) this.params = {};
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
/*
 * Application Class
 *
 * Class representation of your application where you're provided
 * with the capability to inject plugins, as well as, handle
 * dependencies. Also maps all controllers to DOM elements.
 * 
 * @author    Blast Radius (jbueza)
 */
MOJO.define('Application', function() {

"use strict";

function Application() {
  if (!this.options) this.options = {};
  
  var self = this, localOptions = self.options;
    localOptions['locale'] = 'en_CA';
    localOptions['plugins'] = [];
    localOptions['pluginSrc'] = 'js/lib/plugins/';
    localOptions['pluginsAsync'] = true;
    localOptions['environment'] = 'dev';
    localOptions['selector'] = jQuery || (function() { throw new Error('Unable to find jQuery'); }) ();
    self.siteMap = [];
};
/* 
 * Triggered when application is fully bootstrapped
 */
Application.prototype.onComplete = function() {};

/* 
 * Provides the capability to set/get properties of the application, such as,
 * logging, plugins, mode (dev/prod)
 * 
 * @param key { String }
 * @param value { Object }
 *
 * Additionally, you can get a property from the application by specifying only the key
 * app.configure('logging') 
 *
 * @returns application instance { Object }
 */
Application.prototype.configure = function(key, value) {
  if (arguments.length > 1) {
    this.options[key] = value;
    if (this.options.environment == 'dev') try { console.info("Configure: ", key, " -> ", value); } catch(err) {}
    return this;
  } else {
    return this.options[key];
  }
};
/* 
 * Reads the css selector from a map and executes the callback, which is actually 
 * just a function that returns an array of controllers with parameters
 * 
 * @param selector { String | HTML Element } 
 * @param callback { Function }
 * 
 */
Application.prototype.map = function Map(selector, callback) {
  var self = this;
  var elements = $(selector);
  elements.each(function(index, item) {
    self.siteMap.push({ context: item, init: callback });
  });
  
  if ('function' == typeof callback) callback.call(this, self);
  return this;
};

Application.prototype.setupController = function setupController(context, controller, params) {
  if ( 'undefined' == typeof context || !context ) throw new Error("'context' is a required parameter");
  if ( 'undefined' == typeof controller || !controller ) throw new Error("'controller' is a required parameter");
  
  var sizzleContext = $(context);

  var controllerObj = MOJO.controllers[controller];
  var abstractController = new Controller()
    , controllerObj = $.extend(controllerObj, controllerObj.methods)
    , controllerObj = $.extend(controllerObj, abstractController);
  MOJO.controllers[controller] = controllerObj;
  
  if ( typeof controllerObj == 'undefined') throw new Error("Undefined Controller @ ", controller);
  controllerObj.initialize(context, controller, params);
  if('undefined' == typeof context.mojoControllers) context.mojoControllers = [];
  context.mojoControllers.push({controller: controllerObj});
  if (typeof controllerObj.after != 'undefined' && controllerObj.after['Start'] != 'undefined') controllerObj.after['Start'].call(controllerObj, null);
};

Application.prototype.disconnectController = function disconnectController(node, controller) {
  if ( 'undefined' == typeof node || !node ) throw new Error("'node' is a required parameter");
  if ( 'undefined' == typeof controller || !controller ) throw new Error("'controller' is a required parameter");
  $(node).unbind().undelegate();
  if ('undefined' != typeof $(node)[0].mojoControllers) delete $(node)[0].mojoControllers;
  return this;
};
Application.prototype.disconnectControllers = function disconnectControllers(callback) {
  var self = this;
  $(this.siteMap).each(function(index, silo) {
    $(silo.context).unbind().undelegate();
    if ('undefined' != typeof $(silo.context)[0].mojoControllers) delete $(silo.context)[0].mojoControllers;
  });
  if ('undefined' != typeof callback && 'function' == typeof callback) callback.apply(this);
};

Application.prototype.connectControllers = function connectControllers() {
  var self = this
    , controllers2load = [];
    
  $(self.siteMap).each(function(index, mapping) {
    var silos;
    if ('function' == typeof mapping.init ) { 
      silos = mapping.init.call(this);
    } else {
      silos = mapping.init;
    }
    
    $(silos).each(function(i, silo) {
      if (!MOJO.controllers.hasOwnProperty(silo.controller)) { 
        controllers2load.push(silo.controller);
      } else {
        MOJO._loaded[silo.controller] = silo.controller;
      }
    });
  });
  
  if ( self.options.environment == 'dev' ) {
    MOJO.require($.unique(controllers2load), function() {
      $(self.siteMap).each(function(index, mapping) {
      
        if (self.options.environment == 'dev') try { console.log("Mapping [" + index + "]: ", mapping.context); } catch (err) {}
        var silos = ('function' == typeof mapping.init ) ? mapping.init.call(this) : mapping.init;

        $(silos).each(function(i, silo) {
          self.setupController(mapping.context, silo.controller, silo.params);
        });
        
        MOJO.Messaging.publish("/app/start");
      
      });      
    });
  }

};

Application.prototype.getPlugins = function(callback) {
   var self = this, path = self.options.pluginSrc;
   
   if (!self.options.pluginsAsync) $.ajaxSetup({async: false});
   $(self.options.plugins).each(function(index, plugin) {
     MOJO.fetch(path + plugin + ".js");
   });
   if (!self.options.pluginsAsync) $.ajaxSetup({async: true});
   if ('undefined' != typeof callback && 'function' == typeof callback) callback.call(self);
};

/* 
 * Starts the application instance by fetching all plugins, fetching all controllers,
 * mapping the controllers to dom nodes, as well as, emits onComplete
 */
Application.prototype.start = function() {
  var self = this;
  $(document).ready(function() {
    self.disconnectControllers(function() {
      if (self.options.plugins.length) { 
        self.getPlugins(function() {
          MOJO.Messaging.publish("/app/plugins/loaded");
          self.connectControllers();
        });
      } else {
        self.connectControllers();
      }
      self.onComplete();
    });
  });
  
};

Application.prototype.remap = function() {
  var self = this;
  self.disconnectControllers(function() {
    self.connectControllers();
    self.onComplete();
  });
};

  ('undefined' == typeof window) ? process.Application = Application : window.Application = Application;
  window.Application = Application;
  return Application;
});
/* 
  @author       Jaime Bueza
  @description  Class representation of a web service call
  @dependencies jQuery  
*/
MOJO.define('Service', function() {

"use strict"; 

function Service(name, uri, options) {
  if (typeof options == 'undefined' ) options = {};
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
};


Service.prototype.invoke = function(params, callback, scope) {
  var self = this;
  
  var options = this.getOptions() || {}
    , method = options.method
    , uri = self.getURI()
    , responseType = options.responseType || 'JSON';
    
  if (options.template) {
    uri = self.parse(uri, params);
    if (method == 'get') params = null; //blank out params now since they're already in the template
                                        //but only if it's an http GET
  }
  
  $.ajaxSetup({
      dataTypeString: responseType
    , type: method
    , async: options.async || 'true'
    , cache: options.cache || 'false'
    , contentType: options.contentType || "application/json; charset=utf-8"
  });

  $.ajax({ url: uri, data: params })
    .success(function(data) { 
      if ( responseType == 'JSON' && this.contentType.match(/javascript/g)) { 
        data = $.parseJSON(data); 
      }

      if ( 'undefined' != typeof callback ) {
        if ( typeof callback == 'function' ) {
          callback.call(scope, null, data);
        } else {
          //string
          scope[callback](null, data);
        }
      }
  
    })
    .error(function() {
      if ( 'undefined' != typeof callback ) callback.call(scope, "Unable to execute XHR", arguments);
    });
};

/* 
 * Returns the name of the service
 */
Service.prototype.getName = function() {
  return this.name;
};
/*
 * Returns the uri of the service
 */
Service.prototype.getURI = function() {
  return this.uri;
};
/*
 * Returns the options that were set upon service instantiation
 */
Service.prototype.getOptions = function() {
  return this.options;
};
//test 
/*
 * Sets or Gets an option of the current Service
 */
Service.prototype.option = function() {
  if (arguments.length > 1) {
    this.options[arguments[0]] = arguments[1];
    return this;
  } else {
    return this.options[arguments[0]];
  }
};

/* 
 * Provides a helper function for quick templating of RESTful urls
 * eg/ http://mysite.com/api/user/123
 */
Service.prototype.parse = function(content, params) {
  $.each(params, function(key, value) {
    content = content.split("{" + key + "}").join(value);
  });
  return content;
};

window.Service = Service;
return Service;

});
/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
                  http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 */
MOJO.define('ServiceLocator', function() {

"use strict"; 

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