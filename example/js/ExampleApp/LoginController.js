/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
mojo.define('ExampleApp.LoginController', function($) {
  var Controller = {
    events: [
        ['context', '.btn-login', 'click', 'Login']
      , ['context', '.btn-logout', 'click', 'Logout']    
    ],
    methods: {
      Initialize: function() {
      },
      Login: function(requestObj) {
        var context = requestObj.getContextElement();
        alert("Logged in from " + this.controllerClass);
      },
      Logout: function(requestObj) {
        alert("Logged out from " + this.controllerClass);
      }
    }
  };
  return Controller;
});
