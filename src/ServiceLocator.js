/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
                  http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 */
mojo.define('ServiceLocator', function() {

"use strict"; 
var $ = jQuery;
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


window.mojo.ServiceLocator = ServiceLocator;
if (window.MOJO) window.MOJO.ServiceLocator = ServiceLocator;
});