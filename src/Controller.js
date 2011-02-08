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
  this.events = [];
  this.params = [];
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

Controller.prototype.initialize = function(context, controllerName, params) {
  var self = this;
  self.contextElement = context;
  self.controllerClass = controllerName;
  console.log("Initialize!");
  $(self.events).each(function(index, observation) {
//    console.log(observation);
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