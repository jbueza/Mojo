describe("Service Locator", function() {
  var service = new Service("GetUsers", "data/user/{userId}", { template: true});
  
  
  it("should always exist in the window context", function() {
    expect(window.ServiceLocator).toBeDefined();
  });
  
  it("should have the capability to add new service", function() {
    ServiceLocator.addService(service);
    expect(ServiceLocator.getService('GetUsers')).toBeDefined();
    ServiceLocator.removeServices();
  });
  
  
  it("should have the capability to get a specific service", function() {
    
    
  });
  
  it("should have the capability to remove a specific service", function() {
    
  });
  
  
  it("should have the capability to remove all services", function() {
    
  });
  
});