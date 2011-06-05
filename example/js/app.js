ServiceLocator.addService(new Service('UpdateProfile',  'data/success.json'));
ServiceLocator.addService(new Service('GetSXPBlogs',    'http://sxpdata.cloudapp.net/feeds/g3c', { jsonp: true }));

var app = MOJO.create({ baseSrc: 'js/' });

app
  .configure('appName', 'ExampleApp')
  .configure('locale', 'en_US')
  .configure('environment', 'dev')
  .configure('pluginSrc', 'js/lib/plugins/')  
  .configure('plugins', ['jqmodal', 'jcarousel', 'tmpl'])

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

  .map('#gallery-example', function() {
    return [
      { controller: "ExampleApp.GalleryController" }
    ];
  })

  .map('#jsonp-blogs', [ { controller: 'ExampleApp.BlogsController'}])
    
  .start();

