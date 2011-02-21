describe("Application", function() {
  var app = MOJO.create();
  app.configure('appName', 'MyTestApp');
  
  beforeEach(function() {
  });

  it("should be able to set a configuration setting", function() { 
    expect(app.configure('appName')).toEqual('MyTestApp');
  });
  
  it("should allow developers to specify a different base library", function() {
    app.configure('selector', jQuery);
    expect(app.configure('selector')).toBeDefined();
  });
  
  
  it("should have an onComplete event", function() {
    expect(app.onComplete).toBeDefined();
  });
  
  it("should be able to bind a dom element with a particular selector", function() { 

  });
  it("should map controllers when invoking start", function() { });
  it("should fetch all plugins that the application is dependent on", function() { });
});
