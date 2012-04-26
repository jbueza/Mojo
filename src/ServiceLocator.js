/*
 * Provides a singleton that we can access to fetch services for invocation
   -> http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 * @author        Jaime Bueza
 */
mojo.define('mojo.ServiceLocator', function ServiceLocator($) {

  "use strict"; 

  var ServiceLocator = {
    services: {},
    /* 
     * Adds a particular service to the Service Locator
     * @param service {Service Object} An instance of a mojo Service class
     */
    addService: function(service) {
      if (!service) return false;
      this.services[service.name] = service;
      return this;
    },
    /* 
     * Gets a particular service to the Service Locator
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
      if (typeof this.services === undefined) return false;
      return this.services;
    }
  };

  mojo.ServiceLocator = ServiceLocator;
});