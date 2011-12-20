
describe("mojo.Core", function() {
  var MockController = {
    events: [],
    methods: {},
    after: {
      Start: function() {}
    }
  };
  
  describe("mojo.query", function() {
    it("should return an array of DOM elements", function() {
      expect(mojo.query('div').length).toBeGreaterThan(0);
    });
    it("should return false when not passing any parameters", function() {
      expect(mojo.query()).toBeFalsy();
    });
  });
  describe("mojo.queryFirst", function() {
    it("should return an element", function() {
      expect(mojo.queryFirst("div")).toBeDefined();
    });
    it("should return an element stripped of jQuery wrapper", function() {
      expect(mojo.queryFirst("div").id).toEqual("an-element");
    });
    it("should return null when unable to find an element", function() {
      expect(mojo.queryFirst("#a-missing-element")).toBeFalsy();
    });
    it("should return false when calling queryFirst with no parameters", function() {
      expect(mojo.queryFirst()).toBeFalsy();
    });
  });
  
  describe("When using define to create a controller", function() {
    
    it("should throw an error when redefining a controller that already exists", function() {
      mojo.define('MyNewTestController', MockController);
      expect(mojo.define('MyNewTestController', MockController)).toBeFalsy();
    });
    
    it("should throw an error when there is no identifier/name for the controller", function() {
      expect(function() {
        mojo.define(null, {});
      }).toThrow("'id' is required");
    });
    
    it("should throw an error when there is no factory implementation", function() {
      expect(function() {
        mojo.define('HelloWorldController');
      }).toThrow("HelloWorldController missing factory implementation");
    });
  });

  describe("When using requireSync", function() {
    it("should load a module synchronously", function() {
      
    });
  });
  describe("When using the template functionality", function() {
    it("should ensure that Mustache.js is loaded", function() {
      expect(window.Mustache).toBeDefined();
    });
    it("should return false if Mustache.js is not loaded", function() {
      if ('undefined' == typeof window.Mustache) {
        expect(mojo.template()).toBeFalsy();
      } else {
        expect(window.Mustache).toBeDefined();
      }
    })
    it("should throw an error if the 'template' is null", function() {
      expect(function() {
        mojo.template(null, {}, {});
      }).toThrow("'template' is required");
    });
    it("should throw an error if the 'data' is null", function() {
      expect(function() {
        mojo.template(null, {}, {});
      }).toThrow("'template' is required");
    });



  });
  
  describe("When using require to load a controller", function() {
    
    it("should throw an error if no dependencies are specified", function() {
      expect(function() {
        mojo.require(null, function() {});
      }).toThrow("'dependencies' is required");
    });
    
    it("should throw an error if no callback is passed", function() {
      expect(function() {
        mojo.require('TestController', null);
      }).toThrow("'callback' is required");
    });
  });

});

