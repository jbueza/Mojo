//setup
mojo.define('TestController', {
  events: [],
  methodS: {},
  after: {
    Start: function() {
    }
  }
});

describe("Application", function() {
  var app = mojo.create();
  app.configure('appName', 'MyTestApp');
  app.configure('pluginSrc', '../example/js/lib/plugins/');
  
  it("should not be seeding itself into the window context", function() {
    expect(window.Application).toBeUndefined();
  });
  it("should not be a part of the window.MOJO context", function() {
    expect(window.MOJO).toBeUndefined();
  });
  it("should be able to set a configuration setting", function() { 
    app.configure('environment', 'dev');
    expect(app.configure('environment')).toEqual('dev');
  });
  it("should be able to get a configuration setting", function() { 
    expect(app.configure('appName')).toEqual('MyTestApp');
  });
  it("should allow developers to specify a different selector engine", function() {
    app.configure('selector', jQuery.sub());
    expect(app.configure('selector')).toBeDefined();
  });
  it("should find elements through a new selector engine", function() {
    app.configure('selector', jQuery.sub());
    expect(mojo.query("div").length).toBeGreaterThan(0);
  });
  it("should have an onComplete event", function() {
    expect(app.onComplete).toBeDefined();
  });
  
  it("should only initialize controllers when start() is invoked", function() {
    var a = mojo.create();
    a.map('#an-element', [ { controller: 'TestController' }]);
    expect($("#an-element")[0].mojoControllers).toBeUndefined();
  });
  

  it("should be able to bind a dom element with a particular selector", function() { 
    app.map('#an-element', [ { controller: "TestController"} ]);
    app.start();
    window.setTimeout(function() {
      expect(jQuery('#an-element')[0].mojoControllers.length).toEqual(1);
      app.disconnectControllers();
    }, 100);
  });

  /*
  it("should fetch all plugins that the application is dependent on", function() { 
    var a = mojo.create();
    a.configure('pluginSrc', '../example/js/lib/plugins/');
    a.configure('plugins', ['jcarousel']);
    a.configure('pluginsAsync', false);
    a.getPlugins(function() {
      expect(jQuery.jcarousel).toBeDefined();
    });
  });
  */
  
  
  
  describe("Error Cases", function() {
    it("should throw an error when map() is called without a selector parameter", function() {
      expect(function() {
        var a = mojo.create();
        a.map(null, [{ controller: 'TestController' }]);
      }).toThrow("'selector' is a required parameter");
    });

    it("should throw an error when map() is called without a callback parameter", function() {
      expect(function() {
        var a = mojo.create();
        a.map(".test", null);
      }).toThrow("'callback' is a required parameter");
    });
    it("should throw an error when map() is called with a non-String selector argument", function() {
      expect(function() {
        var a = mojo.create();
        a.map({}, [{ controller: "TestController" }]);
      }).toThrow("'selector' needs to be a String");
    });
    it("should throw an error when map() is called with an empty array as its callback argument", function() {
      expect(function() {
        var a = mojo.create();
        a.map(".test", []);
      }).toThrow("'callback' is an array and is required to have controllers");
    });
    
    it("should throw an error when configure() is called without arguments", function() {
      expect(function() {
        var testAppConfigureNoParams = mojo.create();
        testAppConfigureNoParams.configure();
      }).toThrow("passing no parameters into configure() is invalid");
    });
    it("should throw an error when configure() is called with too many arguments", function() {
      expect(function() {
        var testAppConfigureTooManyParams = mojo.create();
        testAppConfigureTooManyParams.configure({}, {}, {});
      }).toThrow("passing too many parameters into configure() is invalid");
    });

    
    describe("When an application invokes setupController()", function() {
      var setupApp = mojo.create();
      it("should throw an error when 'context' parameter is missing()", function() {
        expect(function() {
          setupApp.setupController(null, 'TestController', function() {});
        }).toThrow("'context' is a required parameter");
      });

      it("should throw an error when 'controller' parameter is missing()", function() {
        expect(function() {
          setupApp.setupController(jQuery("<div>"), null, function() {});
        }).toThrow("'controller' is a required parameter");
      });
    });
  });
  

  
  describe("When an application disconnects its associated controllers when invoking disconnectControllers()", function() {
    
    it("should throw an error when 'node' parameter is missing when invoking disconnectController()", function() {
      expect(function() {
        app.disconnectController(null, 'TestController', function() {});
      }).toThrow("'node' is a required parameter");
    });
    
    it("should throw an error when 'controller' parameter is missing when invoking disconnectController()", function() {
      expect(function() {
        app.disconnectController(jQuery("<div>"), null, function() {});
      }).toThrow("'controller' is a required parameter");
    });
    
    it("should allow developers to disconnect all controllers from the application", function() {
      var newApp = mojo.create();
      jQuery(document.body).append(jQuery("<div id='disconnect-test'>"));
      newApp.map("#disconnect-test", [ { controller: "TestController"} ]).start();
      newApp.disconnectControllers();
      expect(jQuery("#disconnect-test")[0].mojoControllers).toBeUndefined();
    });
  });

});
