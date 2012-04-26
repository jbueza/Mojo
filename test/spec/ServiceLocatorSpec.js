describe("mojo.ServiceLocator", function() {
  var service = new mojo.Service("GetUsers", "data/user/{userId}", { template: true});
  var ServiceLocator = mojo.ServiceLocator;
  
  beforeEach(function() {
     ServiceLocator.removeServices();
     ServiceLocator.addService(service);
  });
  
  it("should ensure that the Mojo framework isn't stealing ServiceLocator", function() {
    expect(window.ServiceLocator).toBeUndefined();
  })
  
  it("should always exist in the window context", function() {
    expect(window.mojo.ServiceLocator).toBeDefined();
  });
  
  describe("When returning a list of Services", function() {
    it("should have the capability to add new service", function() {
      expect(ServiceLocator.getService('GetUsers')).toBeDefined();
    });
    it("should have the capability to get a specific service", function() {    
      expect(ServiceLocator.getService('GetUsers')).toBeDefined();
    });
    it("should have the capability to remove a specific service", function() {
      ServiceLocator.removeService('GetUsers');
      expect(ServiceLocator.getService('GetUsers')).toBeUndefined();
    });
    it("shoudl have the capability to return all services", function() {
      expect(ServiceLocator.getServices()).toBeDefined();
    });
    it("should return false if someone duckpunches the services property", function() {
      var LocalServiceLocator = ServiceLocator;
      LocalServiceLocator.services = undefined;
      expect(LocalServiceLocator.getServices()).toBeFalsy();
    });
  });
  
  describe("mojo.ServiceLocator.addService(service)", function() {
    it("should return false if not passing a service", function() {
      expect(ServiceLocator.addService()).toBeFalsy();
    });
    it("should have the capability to remove all services", function() {
      ServiceLocator.addService(new mojo.Service("GetCats", "data/user/{userId}", { template: true}));
      ServiceLocator.addService(new mojo.Service("GetDogs", "data/user/{userId}", { template: true}));
      ServiceLocator.addService(new mojo.Service("GetFrogs", "data/user/{userId}", { template: true}));
      ServiceLocator.removeServices();
      expect(ServiceLocator.services).toEqual({});
    });
  });
});