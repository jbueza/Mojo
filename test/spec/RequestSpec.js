describe("Request", function() {
  var MockController = { getContextElement: jQuery("#an-element") }; 
  jQuery(document.body).append("<a id='test-anchor' href='http://blastmojo.com'>Blast Mojo</a>");
  var testRequest = new Request({ user: "Jaime" }, jQuery("#test-anchor"), {}, MockController);
  it("should throw an error when instantiating a request without a caller object", function() {
    expect(function() { new Request({}, null, {}, {})}).toThrow("'callerObj' is required");
  });
  it("should throw an error when instantiating a request without a event object", function() {
    expect(function() { new Request({}, {}, null, {})}).toThrow("'eventObj' is required");
  });
  it("should throw an error when instantiating a request without a controller object", function() {
    expect(function() { new Request({}, {}, {}, null)}).toThrow("'controllerObj' is required");
  });
  it("should have the capability to return its caller object (what invoked it)", function() {
    expect(testRequest.getCaller()).toBeDefined();
  });
  it("should have the capability to return its wrapped event object", function() {
    expect(testRequest.getEvent()).toBeDefined();
  });
  it("should have the capability to return its controller", function() {
    expect(testRequest.getController()).toBeDefined();
  });
  
});