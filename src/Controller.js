/* 
 * Controller Class
 *
 * An abstract class used in implementing Mojo Controllers. A Controller is an 
 * object that encapsulates all event handling, dispatching and intercepting in 
 * a Mojo application.
 * 
 * @class       Controller
 * @author      Jaime Bueza
 * @constructor
 *
 */
mojo.define('mojo.Controller', function() {  

"use strict";

var $ = jQuery;
var noop = function() {};

function Controller() {
  this.contextElement = null;
  this.controllerClass = null;
  this.events;
};

Controller.prototype.onInit = function() {};
Controller.prototype.onParamChange = function() {};
Controller.prototype.onComplete = function() {};
Controller.prototype.onBind = function() {};
Controller.prototype.onIntercept = function() {};

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
      self.onBind();
      var requestObj = new mojo.Request($(this).data() || {}, this, evt, self);

      if (typeof self.before != 'undefined' && typeof self.before[commandName] != 'undefined') {
        self.before[commandName].call(self, requestObj);
        self.onIntercept('Before');
      }
      
      if (!self.methods[commandName] || 'undefined' == typeof self.methods[commandName]) {
        throw new Error("Command does not exist within Controller");
      }
      try {
        self.methods[commandName].call(mojo.controllers[controllerName], requestObj);
      } catch(err) {
        throw err;
      }
      
      if (typeof self.after != 'undefined' && typeof self.after[commandName] != 'undefined') {
        self.after[commandName].call(self, requestObj);
        self.onIntercept('After');
      }
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
window.mojo.Controller = Controller;
if (window.MOJO) window.MOJO.Controller = Controller;
});
