describe("Service", function() {
  var test = new Service("GetUsers", "data/user/${userId}", { template: true})
    , getTest = new Service("GetUsers", "data/getUsers.json", { template: true})
    , postTest = new Service("AddUser", "data/getUsers.json", { template: true})
    , delTest = new Service("DeleteUser", "data/getUsers.json", { template: true})
    , updateTest = new Service("UpdateUser", "data/getUsers.json", { template: true});
  
  it("should always have a name", function() {
    expect(getTest.getName()).toBe("GetUsers");
  });

  it("should always have a uri", function() {
    expect(getTest.getURI()).toBe("data/getUsers.json");
  });

  it("should be a GET if the service name starts with 'get'", function() {
    expect(getTest.getOptions().method).toBe('get');
  });

  it("should be a POST if the service name starts with 'add'", function() {
    expect(postTest.getOptions().method).toBe('post');
    
  });

  it("should be a POST if the service name starts with 'del'", function() {
    expect(delTest.getOptions().method).toBe('post');
  });

  it("should be a POST if the service name starts with 'update'", function() {
    expect(updateTest.getOptions().method).toBe('post');
  });
  
  it("should allow developers to set the responseType to html", function() {
    
  });

  it("should have templating off by default", function() {
    var testDefaultService = new Service("GetWhat", "/api/test");
    expect(testDefaultService.option('template')).toBeFalsy();
  });

  it("should allow the developer to turn off templating", function() {
    test.option('template', false);
    expect(test.option('template')).toBeFalsy();
  });

  it("should allow the developer to turn on templating", function() {
    test.option('template', true);
    expect(test.option('template')).toBeTruthy();
  });

  it("should return a properly templated URI", function() {
    //getTest.invoke({ userId: 'jbueza' }, function() {}, this);
  });

  
  
});