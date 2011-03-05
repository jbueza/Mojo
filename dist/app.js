/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
    , ['context', '.btn-ajax-test', '', 'LoginServiceCall']
    
  ],
  methods: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  },
  before: {
    Login: function() {
      console.log("[intercept] Before Login");
    }
  },
  after: {
    Start: function() {
      //Initialization
      console.log("Mapped Login Controller");
    },
    Login: function() {
      console.log("[intercept] After Login");
    }
  }
});/* 
 * @class   Registration Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.RegistrationController', {
  events: [
      ['context', '.btn-submit-registration', 'click', 'Register']
    , ['dom', '.btn-test-outside', 'click', 'Register']
  ],
  methods: {
    Register: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("REGISTER from " + this.controllerClass);
    }
  }
});MOJO.define('ExampleApp.member.ProfileController', {
  events: [
    [ 'context', '.btn-save-profile', 'click', 'Save' ]
  ],
  methods: {
    Save: function(requestObj) {  
      var params = {};
      $("input[type=text], textarea").each(function(i, input) {
        input = $(input);
        params[input.attr('name')] = input.val();
      });
      ServiceLocator.getService('UpdateProfile').invoke(params, function(err, data) {
        console.log("Success!");
        $(".success", this.getContextElement()).show('fast');
      }, this);
    }
  },
  after: {
    Start: function() {
      var self = this;
      $.each(this.params, function(key, value) {
        $("input[name='" + key + "']", self.getContextElement()).val(value);
      });
    }
  }
});