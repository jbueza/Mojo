/*
 * @author        Jaime Bueza
 * @description   Provides a singleton that we can access to fetch services for invocation
                  http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html
 * @class         ServiceLocator
 */
MOJO.define('ServiceLocator', function() {

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
  window.ServiceLocator = ServiceLocator;
  return ServiceLocator;

});