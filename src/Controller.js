/* 
 * Controller Class
 *
 * Provides an implementation silo for developers
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
};

/* 
 * A brave salute to the heroes of the past! They will forever be legendary!
 */
Controller.prototype.addObservers = function() {};
Controller.prototype.addCommands = function() {};
Controller.prototype.addIntercepts = function() {};
Controller.prototype.addCommand = function(name, location) {
  this.methods.push({ commandName: name, command: location });
};

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
      
    if(scope == "context") root = $(context);
    
    $(root).delegate(selector, eventName, function(evt) {
      var requestObj = new Request({}, this, evt, self);
      self.methods[commandName].call(self, requestObj);
    });
  });
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

Controller.prototype.intercept = function(when, callback, callbackInterceptor, params) {
  
};