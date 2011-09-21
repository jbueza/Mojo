/* 
 * @class   Registration Controller
 * @author  Jaime Bueza
 */
mojo.define('ExampleApp.RegistrationController', {
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
});