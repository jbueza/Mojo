ServiceLocator.addService(new Service('UpdateProfile', 'data/success.json'));


var app = MOJO.create({ mojoSrc: '../src' });

app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')
  .configure('environment', 'prod')
  .configure('pluginSrc', 'js/lib/plugins/')  
  .configure('plugins', ['jqmodal', 'jcarousel'])
  
  .map('#registration-example', function() {
    return [
      { controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }}
    ];
  })

  .map('#login-example', function() {
    return [
      { controller: "ExampleApp.LoginController" }
    ];
  })
  
  .map('#login-example2', function() {
    return [
      { controller: "ExampleApp.LoginController" }
    ];
  })
  
  .map('#profile-example', function() {
    return [
      { controller: "ExampleApp.member.ProfileController", params: { 'currentCity': 'Vancouver', 'hometown': 'Winnipeg' }}
    ];
  })
  
  .start()
  
