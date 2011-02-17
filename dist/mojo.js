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
};/* 
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
  this.delegates = [];
  this.events;
};

Controller.prototype.onInit = function() {};

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
 * @member  Controller
 * @return  {Boolean}
 */
Controller.prototype.bind = function(element) {
  
};

/* 
 * A brave salute to the heroes of the past! They will forever be legendary!
 */
Controller.prototype.addObservers = function() {};
Controller.prototype.addCommands = function() {};
Controller.prototype.addCommand = function(name, location) {};


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
      localOptions['appSrc'] = 'js/';
      localOptions['locale'] = 'en_CA';
      localOptions['plugins'] = [];
      localOptions['pluginSrc'] = 'js/lib/plugins/';
      localOptions['environment'] = 'dev';
      localOptions['selector'] = jQuery || (function() { throw new Error('Unable to find jQuery'); }) ();
      self.siteMap = [];
};

Application.prototype.onComplete = function() {};

Application.prototype.configure = function(key, value) {
  if (arguments.length > 1) {
    this.options[key] = value;
    try { console.info("Configure: ", key, " -> ", value); } catch(err) {}
    return this;
  } else {
    return this.options[key];
    //allow app.configure('appSrc') to get appSrc
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
  
  var controllerObj = MOJO.controllers[controller];
  
  if ( typeof controllerObj == 'undefined') throw new Error("Undefined Controller @ ", controller);
  
  controllerObj.initialize(context, controller, params);
  
  var controllerInstance = { name: controller, controller: controllerObj };
  
  if (typeof sizzleContext.data('controllers') == 'undefined') sizzleContext.data('controllers', []);
  
  $(context).data('controllers').push(controllerInstance);
  
  if (typeof controllerObj.after != 'undefined' && controllerObj.after['Start'] != 'undefined') controllerObj.after['Start'].call(controllerObj, null);
};

Application.prototype.disconnectControllers = function(callback) {
  var self = this;
  
  $(self.siteMap).each(function(index, silo) {
    $(silo.context).unbind();
  });
  
  callback.apply(self);
};
Application.prototype.connectControllers = function() {
  var self = this;
  $(self.siteMap).each(function(index, mapping) {
    
    if (self.options.environment == 'dev') try { console.log("Mapping: ", mapping.context); } catch (err) {}

    var silos = mapping.init.call(this);
    
    $(silos).each(function(i, silo) {
      var contextElement    = mapping.context
        , sizzleContext     = $(contextElement)
        , controllerParams  = silo.params
        , controllerName    = silo.controller;
        
      if (!MOJO._loaded.length || $.inArray(silo.controller, MOJO._loaded) == -1) {        
        MOJO.require(self.options.appSrc +  (controllerName.replace(/\./g, "\/") + ".js"), function(response) {
          console.log("Loaded Controller: ", controllerName);
          self.setupController(contextElement, controllerName, controllerParams);
        });
      } else {
        self.setupController(contextElement, controllerName, controllerParams);
      }
      MOJO._loaded.push(controllerName);
      
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
     MOJO.require(path + plugin + ".js");
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
  
};/* 
  @author       Jaime Bueza
  @description  Provides a look up for RESTful web services by using
                the service locator pattern. Frontend service locator needs to be
                browser compatible so we use only GET/POST for web services.
  @dependencies jQuery (John Resig)
    
  //Setup your services so your frontend can invoke any service at any time
  ServiceLocator.addService(new Service('GetUsers',   '/users', { method: 'get' }));
  ServiceLocator.addService(new Service('AddUser',    '/user/create', { method: 'post' }));
  ServiceLocator.addService(new Service('UpdateUser', '/user/update', { method: 'post' }));
  ServiceLocator.addService(new Service('DeleteUser', '/user/delete', { method: 'post' }));
  
  ServiceLocator.addService(new Service('GetUser',   '/users/${id}', { method: 'get', template: true }));

  //click handler on get users
  var User = {
    render: function(response) {
      //$("#userView").html(response); //for html based responses.
      $("#userTemplate").tmpl(response).appendTo("#view"); //for jq tmpl json responses
    }
  };
  
  $("#btn-get-users").click(function() {
    ServiceLocator.getService('GetNotes').invoke({}, "render", User);
  });
  
*/
  
function Service(name, uri, options) {
  this.name = name;
  this.uri = uri;
  this.options = options;
};

Service.prototype.invoke = function(params, callback, scope) {

  var self = this;
  
  var options = this.getOptions() || {}
    , method = options.method || function() {
      var type = "get";
      
      if (self.getName().match(/^get/i)) {
        type = "get";
      } else if (self.getName().match(/^add|del|update/i)) {
        type = "post";
      }
      return type;
    }()
    , uri = this.uri || '/api'
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


/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
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
var MOJO = function() {};

MOJO._loaded = [];

MOJO._resolvedNamespace = function(namespace) {
    return MOJO._namespace._provided['' + namespace];
};
MOJO._namespace = function(namespace) {
  var list = ('' + namespace).split(/\./)
    , listLength = list.length
    , obj = []
    , context = window;

  if (!MOJO._namespace._provided) MOJO._namespace._provided = {};


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
  //move to CommonJS AMD spec coming soon!
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
  return new Application(options);
};
