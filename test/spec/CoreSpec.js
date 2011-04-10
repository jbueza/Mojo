
describe("Core", function() {
  var MockImplementation = {
    events: [],
    methods: {},
    after: {
      Start: function() {}
    }
  };
  beforeEach(function() {
    
  });
  describe("When using query to retrieve HTML elements", function() {
    it("should return an array of DOM elements", function() {
      expect(MOJO.query('div').length).toBeGreaterThan(0);
    });
  });
  
  describe("When using define to create a controller", function() {
    it("should throw an error when redefining a controller that already exists", function() {
      expect(function() {
        MOJO.define('MyNewTestController', MockImplementation);
        MOJO.define('MyNewTestController', MockImplementation);
      }).toThrow("MyNewTestController controller already exists");
    });
    
    it("should throw an error when there is no identifier/name for the controller", function() {
      expect(function() {
        MOJO.define(null, {});
      }).toThrow("'id' is required");
    });
    
    it("should throw an error when there is no factory implementation", function() {
      expect(function() {
        MOJO.define('HelloWorldController');
      }).toThrow("HelloWorldController missing factory implementation");
    });
    
    
  });
  
  describe("When using require to load a controller", function() {
//    it("should ")
  });

});

