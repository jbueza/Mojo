
describe("Core", function() {
  var MockFactory = {
    events: [],
    methods: {},
    after: {
      Start: function() {}
    }
  };

  describe("When using query to retrieve HTML elements", function() {
    
    it("should return an array of DOM elements", function() {
      expect(mojo.query('div').length).toBeGreaterThan(0);
    });
  });
  
  describe("When using define to create a controller", function() {
    
    it("should throw an error when redefining a controller that already exists", function() {
      mojo.define('MyNewTestController', MockFactory);
      expect(mojo.define('MyNewTestController', MockFactory)).toBeFalsy();
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
    it("should throw an error if you invoke mojo.template() without Mustache.js", function() {
      expect(function() {
        mojo.template();
      }).toThrow("'Mustache.js' templating library is required");
    });
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

