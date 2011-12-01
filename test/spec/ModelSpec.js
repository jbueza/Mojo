describe("mojo.Model", function() {
	describe("mojo.Model basic specs", function() {
	  it("should ensure that the Mojo framework isn't stealing Model in the window context", function() {
      expect(window.Model).toBeUndefined();
    });
    it("should ensure that MOJO.* does not exist", function() {
    	expect(window.MOJO).toBeUndefined();
    });

    it("should always exist in the window context", function() {
      expect(window.mojo.Model).toBeDefined();
    });
    it("should always have a Model Registry", function() {
      expect(window.mojo.ModelRegistry).toBeDefined();
    });
  
    it("should always be empty on startup", function() {
      expect(jQuery.isEmptyObject(window.mojo.ModelRegistry)).toBeTruthy();
    });
	});  
	
	describe("mojo.ModelRegistry", function() {
	  it("should never have an index below 0", function() {
	    
	  });
	  it("should never have over 1000 models for application constraints", function() {
	    
	  });
	});

  describe("mojo.Model.set", function() {  
    it("should always have a set method", function() {
      expect(window.mojo.Model.set).toBeDefined();
    });
    it("should return the model when setting a DOM model instead of HTML view model", function() {
      var data = { name: "Jaime" };
      var model = mojo.Model.set('test', data);
      expect(model.name).toEqual('Jaime');
    });
    it("should return the generated HTML when setting a Model with data", function() {
      var data = { Name: "Jaime" };
      var ts = new Date().getTime();
      var randomElement = $("<div id='" + ts + "' modelSource='testModelWithGeneratedMarkup'><p>{{Name}}</p></div>");
      $(document.body).append(randomElement);
      var generatedHtml = mojo.Model.set("testModelWithGeneratedMarkup", data);
      expect(generatedHtml).toEqual("<p>Jaime</p>");
      $("#" + ts).remove(); //cleanup
    });
  });
  
  describe("mojo.Model.get", function() {
    it("should always have a get method", function() {
      expect(window.mojo.Model.get).toBeDefined();
    });
    it("should return false when passing a key of a model that doesn't exist", function() {
      expect(mojo.Model.get("lolwat")).toBeFalsy();
    });
    it("should return false when passing in a key that isn't a string", function() {
      expect(mojo.Model.get({})).toBeFalsy();
    });
    it("should return false when passing no parameters", function() {
      expect(mojo.Model.get()).toBeFalsy();
    });
    it("should return false when passing more than one parameter", function() {
      expect(mojo.Model.get('test', 'meow', 'mix')).toBeFalsy();
    });
  });
  describe("mojo.Model.remove", function() {
    it("should always have a remove method", function() {
      expect(window.mojo.Model.remove).toBeDefined();
    });
    it("should return false when passing a key of a model that doesn't exist", function() {
      expect(mojo.Model.remove("TestKeyDoesNotExist")).toBeFalsy();
    });
    it("should return false when passing in a key that isn't a string", function() {
      expect(mojo.Model.remove({})).toBeFalsy();
    });
    it("should return false when passing no parameters", function() {
      expect(mojo.Model.remove()).toBeFalsy();
    });
    it("should return false when passing more than one parameter", function() {
      expect(mojo.Model.remove('test', 'meow', 'mix')).toBeFalsy();
    });
    it("should remove the model from the Model Registry", function() {
      mojo.Model.set("TestDeleteModelFromModelRegistry", true);
      mojo.Model.remove("TestDeleteModelFromModelRegistry");
      expect(mojo.Model.get("TestDeleteModelFromModelRegistry")).toBeFalsy();
    });
  })
});