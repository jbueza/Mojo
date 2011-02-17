describe("Controller", function() {
  var controller
    , element = $("#an-element")
    , params = { user: 'jbueza'};
  beforeEach(function() {
    controller = new Controller();
    controller.initialize(element, 'TestController', params);
  });

  it("should create a Mojo Controller", function() { 
    expect(controller.controllerClass).toEqual('TestController');
  });
  it("should have a context element associated to it", function() { });
  it("should have a controller name", function() { });
  it("should be able to have optional parameters associated with it", function() { });
  it("should have an 'onInit' event", function() { });
  it("should return a context element when callling getContextElement()", function() { });
});
