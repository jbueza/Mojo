var app = MOJO.create({ mojoSrc: '../src' });
app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')
  .configure('environment', 'prod')
  .configure('plugins', ['jqmodal', 'jcarousel'])

  
  .get('#registration-example', function() {
    return [
      { controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }}
    ];
  })

  .get('#login-example', function() {
    return [
      { controller: "ExampleApp.LoginController", params: { user: 22, firstName: "Johnson" }}
    ];
  })
  
app.start()