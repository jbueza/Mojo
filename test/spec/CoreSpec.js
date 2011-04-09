describe("Core", function() {
  beforeEach(function() {
    
  });


  
  
  describe("query", function() {
    it("should return an array of DOM elements", function() {
      expect(MOJO.query('div').length).toBeGreaterThan(0);
    });
  });
  
  describe("define", function() {
    it("should throw an error when redefining a controller that already exists", function() {

    });
  });
  
  describe("require", function() {
    
  });

});

