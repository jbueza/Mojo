mojo.ServiceLocator.addService(new mojo.Service('getUpdateProfile',  'data/success.json'));
mojo.ServiceLocator.addService(new mojo.Service('GetSXPBlogs',    'http://sxpdata.cloudapp.net/feeds/g3c', { jsonp: true }));



var app = mojo.create({ baseSrc: 'js/' });
mojo.requireSync('ExampleApp.service.Locator');

app
  .configure('appName', 'ExampleApp')
  .configure('locale', 'en_US')
  .configure('environment', 'dev')
  .configure('logging', true)
  .configure('pluginSrc', 'js/lib/plugins/')  
  .configure('plugins', ['jqmodal', 'tmpl'])

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

  .map('#profile-example', function() {
    return [
      { controller: "ExampleApp.member.ProfileController", params: { 'currentCity': 'Vancouver', 'hometown': 'Winnipeg' }}
    ];
  })

  .map('#jsonp-blogs', [ { controller: 'ExampleApp.BlogsController'}])
    
  .start();

