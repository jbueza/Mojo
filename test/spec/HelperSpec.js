describe("mojo.helper", function() {
  
  it("should exist in the window object", function() {
    expect(window.mojo.helper).toBeDefined();
  });
  describe("mojo.helper.isUrl", function() {
    it("should exist", function() {
      expect(window.mojo.helper.isUrl).toBeDefined();
    })
    it("should return false if `value` is null", function() {
      expect(window.mojo.helper.isUrl()).toBeFalsy();
    });
    it("should return true if `value` is a fully qualified url", function() {
      expect(window.mojo.helper.isUrl("http://www.google.com")).toBeTruthy();
    });
    it("should return true if `value` is an ftp qualified url", function() {
      expect(window.mojo.helper.isUrl("ftp://www.google.com")).toBeTruthy();
    });
  });
  describe("mojo.helper.isEmail", function() {
    it("should exist", function() {
      expect(window.mojo.helper.isEmail).toBeDefined();
    })
    it("should return false if `value` is null", function() {
      expect(window.mojo.helper.isEmail()).toBeFalsy();
    });
    it("should return true if `value` is a fully qualified RFC 2822 email address", function() {
      expect(window.mojo.helper.isEmail("jbueza@gmail.com")).toBeTruthy();
    });
    it("should return true if `value` is an email address with + sign", function() {
      expect(window.mojo.helper.isEmail("jbueza+lolcats@gmail.com")).toBeTruthy();
    });
  });
});