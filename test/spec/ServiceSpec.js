describe("mojo.Service", function() {
  var testService = new mojo.Service("GetUsers", "data/user/{userId}", { template: true})
    , getTestService = new mojo.Service("GetUsers", "data/user.js")
    , postTestService = new mojo.Service("AddUser", "data/user.js")
    , delTestService = new mojo.Service("DeleteUser", "data/user.js")
    , updateTestService = new mojo.Service("UpdateUser", "data/user.js")
    , jsonpTestService = new mojo.Service('GetSXPBlogs', 'http://sxpdata.cloudapp.net/feeds/g3c', { jsonp: true })
    , brokenService = new mojo.Service("Broken", "data/broken.js")
    , testPostAsGetService = new mojo.Service("getUsersButAsPostService", "data/user.js", { method: "post"});
  
  it("should always have a name", function() {
    expect(getTestService.getName()).toBe("GetUsers");
  });

  it("should always have a uri", function() {
    expect(getTestService.getURI()).toBe("data/user.js");
  });

  it("should be a GET if the service name starts with 'get'", function() {
    expect(getTestService.getOptions().method).toBe('get');
  });

  it("should be a POST if the service name starts with 'add'", function() {
    expect(postTestService.getOptions().method).toBe('post');
  });

  it("should be a POST if the service name starts with 'del'", function() {
    expect(delTestService.getOptions().method).toBe('post');
  });

  it("should be a POST if the service name starts with 'update'", function() {
    expect(updateTestService.getOptions().method).toBe('post');
  });
  
  it("should allow null for passing parameters into the service call", function() {
    getTestService.invoke(null, function(err, data) { expect(err).toBeUndefined(); }, null);
  });
  it("should allow empty hash object for passing parameters into the service call", function() {
    getTestService.invoke({}, function(err, data) { expect(err).toBeUndefined(); }, null);
  });

  it("should allow developers to set the contentType to html", function() {
    var htmlService = new mojo.Service("Partial", "data/markup.html", { contentType: "text/html" });
    htmlService.invoke(null, function(err, data) { expect(data).toBe('<p>Hello World</p>'); }, null);
  });
  
  it("should not have an error object passed into the callback on a successful service call", function() {
    getTestService.invoke({}, function(err, data) { expect(err).toBeUndefined(); }, null);
  });
  
  it("should have pass the response back into the callback on a successful service call", function() {
    getTestService.invoke({}, function(err, data) { expect(data.success).toBeTruthy(); }, null);
  });
  
  it("should have an error object get passed into the callback on an erroneous service call", function() {
    brokenService.invoke({}, function(err, data) { expect(err).toBeDefined(); }, null);
  });
  
  it("should have templating off by default", function() {
    var testDefaultService = new mojo.Service("GetWhat", "/api/test");
    expect(testDefaultService.option('template')).toBeFalsy();
  });

  it("should allow the developer to turn off templating", function() {
    testService.option('template', false);
    expect(testService.option('template')).toBeFalsy();
  });

  it("should allow the developer to turn on templating", function() {
    testService.option('template', true);
    expect(testService.option('template')).toBeTruthy();
  });

  it("should return a properly templated URI", function() {
    expect(testService.parse("/api/user/{user}", { user: 'jbueza'})).toBe("/api/user/jbueza");
  });
  
  it("should allow the developer to turn on cross-domain calls (jsonp)", function() {
    jsonpTestService.option('jsonp', true);
    expect(jsonpTestService.option('jsonp')).toBeTruthy();
  });
  
  it("should allow the developer to turn on cross-domain calls (jsonp)", function() {
    jsonpTestService.option('jsonp', true);
    expect(jsonpTestService.option('jsonp')).toBeTruthy();
  });
  it("should not allow developers to pass more than 2 arguments", function() {
     expect(jsonpTestService.option('jsonp', true, true)).toBeFalsy();
  });
  it("should not allow developers to pass a non-string value as the first parameter", function() {
     expect(jsonpTestService.option(true)).toBeFalsy();
  });
  
  it("should not allow developers to pass no parameters", function() {
     expect(jsonpTestService.option()).toBeFalsy();
  });
  //test to see if scope is optional
  
  //test to see if the jsonp service returns proper data
  
  
  
});