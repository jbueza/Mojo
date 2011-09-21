/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
                  http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 */
mojo.define('mojo.ServiceLocator', function() {

"use strict"; 
var $ = jQuery;
var ServiceLocator = {
  services: {},
  addService: function(service) {
    this.services[service.name] = service;
    return this;
  },
  /* 
   * Adds a particular service to the Service Locator
   * @param service {Service Object} An instance of a mojo Service class
   */
  getService: function(name) {
    return this.services[name];
  },
  /* 
   * Removes a particular Service from the Service Locator
   * @param name {String} Specific service to be removed
   */
  removeService: function(name) {
    delete this.services[name];
  },
  /* 
   * Destroys all service references in the Service Locator
   */
  removeServices: function() { 
    this.services = {}; 
    return true;
  },
  /*
   * Returns all services in the Service Locator
   */
  getServices: function() {
    return this.services;
  }
};

window.mojo.ServiceLocator = ServiceLocator;
if (window.MOJO) window.MOJO.ServiceLocator = ServiceLocator;
});