describe("Service", function() {
  var testService = new Service("GetUsers", "data/user/{userId}", { template: true})
    , getTestService = new Service("GetUsers", "data/getUsers.json")
    , postTestService = new Service("AddUser", "data/getUsers.json")
    , delTestService = new Service("DeleteUser", "data/getUsers.json")
    , updateTestService = new Service("UpdateUser", "data/getUsers.json");
  
  it("should always have a name", function() {
    expect(getTestService.getName()).toBe("GetUsers");
  });

  it("should always have a uri", function() {
    expect(getTestService.getURI()).toBe("data/getUsers.json");
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
  
  it("should allow developers to set the contentType to html", function() {
    var htmlService = new Service("Partial", "data/markup.html", { contentType: "text/html" });
    htmlService.invoke(null, function(err, data) {
      expect(data).toBe('<p>Hello World</p>');
    }, this);
  });

  it("should have templating off by default", function() {
    var testDefaultService = new Service("GetWhat", "/api/test");
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
});


describe("Kentico Service", function() {
  
});