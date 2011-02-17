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
 * @member Controller
 */
 
Controller.prototype.param = function(key, value) {
  if (arguments.length > 1) {
    this.params[key] = value;
    return this;
  } else {
    return this.params[key];
  }
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


