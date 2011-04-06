//setup

MOJO.define('TestController', {
  events: [],
  methodS: {},
  after: {
    Start: function() {
    }
  }
});

describe("Application", function() {
  var app = MOJO.create();
  app.configure('appName', 'MyTestApp');
  app.configure('pluginSrc', '../example/js/lib/plugins/');

  beforeEach(function() {
    app.configure('plugins', []);
  });

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
    app.map('#an-element', [ { controller: "TestController"} ]);
    app.configure('plugins', []);
    app.start();
    window.setTimeout(function() {
      expect(jQuery('#an-element')[0].mojoControllers.length).toEqual(1);
      app.disconnectControllers();
    }, 100);
  });
  it("should fetch all plugins that the application is dependent on", function() { 
    app.configure('plugins', ['jcarousel']);
    app.getPlugins(function() {
        expect(jQuery.jcarousel).toBeDefined();
    });

  });
});
