describe("Controller", function() {
  var controller
    , element = $("#an-element")
    , params = { user: 'jbueza'};
    
  beforeEach(function() {
    controller = new mojo.Controller();
    controller.initialize(element, 'TestController', params);
  });

  it("should create a Mojo Controller", function() { 
    expect(controller.controllerClass).toEqual('TestController');
  });
  
  it("should have a context element associated to it", function() {
    expect(controller.contextElement).toBeDefined();
  });
  
  it("should have a controller name", function() { 
    expect(controller.controllerClass).toEqual('TestController');
  });
  
  it("should return the context element getContextElement()", function() { 
    expect(controller.getContextElement()).toBeDefined();
  });
  
  describe("events", function() {
    it("should have an 'onInit' event", function() { 
      expect(controller.onInit).toBeDefined();
    });
    it("should have an 'onComplete' event", function() {
      expect(controller.onComplete).toBeDefined();
    });
    it("should have an 'onParamChange' event", function() {
      expect(controller.onParamChange).toBeDefined();
    });
    it("should have an 'onBind' event", function() {
      expect(controller.onBind).toBeDefined();
    });
    it("should have an 'onIntercept' event", function() {
      expect(controller.onIntercept).toBeDefined();
    });
  });
  
  describe("parameters", function() {
    it("should be able to have optional parameters associated with it", function() { 
      expect(controller.param('user')).toEqual('jbueza');
    });
    it("should allow developers to add parameters on demand", function() {
      controller.param('myNewParam', true);
      expect(controller.param('myNewParam')).toBe(true);
    });
  });


});
