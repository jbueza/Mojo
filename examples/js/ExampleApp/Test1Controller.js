MOJO.define('ExampleApp.Test1Controller', Controller, {
  events: [
      ['context', 'click', '.btn-login', 'Login']
    , ['context', 'click', '.bnt-logout', 'Logout']
  ],
  commands: {
    Login: function(requestObj) {
      
      console.log("Clicked Login");
    }
    //}, //you can specify a callback or a command object now
    //Logout: new Command('ExampleApp.command.Logout')
  }
});