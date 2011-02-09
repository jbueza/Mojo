/* 
 * @class   Registration Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.RegistrationController', Controller, {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
  ],
  commands: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  }
});