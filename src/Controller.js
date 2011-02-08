/* 

MOJO.define('ExampleApp.Test1Controller', Controller, {
  events: [
      ['context', 'click', '.btn-login', 'Login']
    , ['context', 'click', '.bnt-logout', 'Logout']
  ],
  commands: {
    Login: function() {
      
    }, //you can specify a callback or a command object now
    Logout: new Command('ExampleApp.command.Logout')
  }
});

*/

/* 
 * Controller Class
 *
 * @class       Controller
 * @author      Blast Radius (jbueza)
 * @constructor
 * @description Provides an implementation silo for developers
 *
 */

function Controller(context, controllerClass, params) {
  this.contextElement = context;
  this.controllerClass = controllerClass;
  if(!this.params) this.params = params || {};
  if(!this.events) this.events = [];
  
  
  this.initialize();
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

Controller.prototype.initialize = function() {
  var self = this;
  console.log("Initializing...");
};

Controller.prototype.

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