/* 
 * Controller Class
 *
 * @class       Controller
 * @author      Blast Radius (jbueza)
 * @constructor
 * @description Provides an implementation silo for developers
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
  this.commands.push({ commandName: name, command: location });
};

Controller.prototype.getRequestObject = function() {
  return {
  
  }
};
Controller.prototype.initialize = function(context, controllerName, params) {
  var self = this;
  self.contextElement = context;
  self.controllerClass = controllerName;
  
  self.params = params;
  $(self.events).each(function(index, observer) {
    if(observer[0] == "context") {
      //delegate to context
      $(self.contextElement).delegate(observer[1], observer[2], function(event) {
        var requestObj = self.getRequestObject();
        requestObj['eventObj'] = event;
        requestObj['caller'] = this;
      });
      
    } else {
      //delegate to body
    }
    
  });


};

/* 
 * @member  Controller
 * @return  {DOM} Attached context element
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