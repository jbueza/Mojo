//setup

MOJO.define('TestController', {
  events: [],
  methodS: {},
  after: {
    Start: function() {
      console.log("Mapped");
    }
  }
});

describe("Application", function() {
  var app = MOJO.create();
  app.configure('appName', 'MyTestApp');
  app.configure('pluginSrc', '../example/js/lib/plugins/');


  it("should be able to set a configuration setting", function() { 
    expect(app.configure('appName')).toEqual('MyTestApp');
  });
  
  it("should allow developers to specify a different selector engine", function() {
    app.configure('selector', jQuery.sub());
    expect(app.configure('selector')).toBeDefined();
  });
  
  it("should have an onComplete event", function() {
    expect(app.onComplete).toBeDefined();
  });
  
  it("should be able to bind a dom element with a particular selector", function() { 
    
//    app.map('#an-element',   function() {   return [ { controller: 'TestController' } ]});
    app.map('#an-element', [ { controller: "TestController"} ]);
  });
  it("should map controllers when invoking start", function() { 
  
  });
  it("should fetch all plugins that the application is dependent on", function() { 
    
  });
});
