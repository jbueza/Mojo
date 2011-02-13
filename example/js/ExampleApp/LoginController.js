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
    },
    Login: function() {
      console.log("[intercept] After Login");
    }
  }
});