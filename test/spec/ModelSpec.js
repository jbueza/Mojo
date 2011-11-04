describe("mojo.Model", function() {
	
  it("should ensure that the Mojo framework isn't stealing Model in the window context", function() {
    expect(window.Model).toBeUndefined();
  });
  it("should ensure that MOJO.* does not exist", function() {
  	expect(window.MOJO).toBeUndefined();
  });
  
  it("should always exist in the window context", function() {
    expect(window.mojo.Model).toBeDefined();
  });
  
  it("should always have a set method", function() {
    expect(window.mojo.Model.set).toBeDefined();
  });

  it("should always have a get method", function() {
    expect(window.mojo.Model.get).toBeDefined();
  });

});