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
  
};