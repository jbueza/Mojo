/*
  
*/
Application = function() {
  if (!this.options) this.options = {};
  
  var self = this, localOptions = self.options;
      localOptions['appSrc'] = 'js/';
      localOptions['locale'] = 'en_CA';
      localOptions['plugins'] = [];
      localOptions['environment'] = 'dev';
      self.map = [];
};

Application.prototype.configure = function(key, value) {
  this.options[key] = value;
  console.info("Configure: ", key, " -> ", value);
  return this;
};

Application.prototype.get = function(selector, callback) {
  var self = this;
  var elements = $(selector);
  elements.each(function(index, item) {
    self.map.push({ context: item, init: callback });
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
  MOJO.controllers[controller].initialize(context, controller, params);
  var controllerInstance = { namee: controller, controller: MOJO.controllers[controller] };
  if (typeof sizzleContext.data('controllers') == 'undefined') sizzleContext.data('controllers', []);
  $(context).data('controllers').push(controllerInstance);
};

Application.prototype.disconnectControllers = function(callback) {
  var self = this;
  $(self.map).each(function(index, silo) {
    $(silo.context).unbind();
  });
  
  callback.apply(self);
};
Application.prototype.connectControllers = function() {
  var self = this;
  $(self.map).each(function(index, mapping) {
    
    if (self.options.environment == 'dev') try { console.log("Mapping: ", mapping.context); } catch (err) {}

    var silos = mapping.init.call(this);
    
    $(silos).each(function(i, silo) {
      var contextElement    = mapping.context
        , sizzleContext         = $(contextElement)
        , controllerParams  = silo.params
        , controllerName    = silo.controller;
      
      if (!MOJO._loaded.length || !$.inArray(silo.controller, MOJO._loaded)) {
        $.getScript(self.options.appSrc +  (controllerName.replace(/\./g, "\/") + ".js"), function(response) {
          console.log("Loaded Controller: ", controllerName);
          self.setupController(contextElement, controllerName, controllerParams);
        });
      } else {
        //already in memory
        self.setupController(contextElement, controllerName, controllerParams);
      }
    });
  });

};
Application.prototype.on = function(eventName, callback) {
  return function() {
  };
};

Application.prototype.start = function() {
  var self = this;
  $(document).ready(function() {
    self.disconnectControllers(function() {
      self.connectControllers();
      
    });
  });
  
};