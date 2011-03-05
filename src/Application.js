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
