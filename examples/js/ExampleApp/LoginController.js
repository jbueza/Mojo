MOJO.define('ExampleApp.LoginController', Controller, {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.bnt-logout', 'click', 'Logout']
  ],
  commands: {
    Login: function(requestObj) {
      console.log("Request Object: ", requestObj);
    }
    //}, //you can specify a callback or a command object now
    //Logout: new Command('ExampleApp.command.Logout')
  }
});