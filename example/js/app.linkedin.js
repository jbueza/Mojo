ServiceLocator.addService(new Service('GetUserProfile', 'data/success.json'));

var app = MOJO.create({ baseSrc: 'js/' });

app
  .configure('appName', 'LinkedInApp')
  .configure('environment', 'dev')
  .configure('pluginSrc', 'js/lib/plugins/')
  .configure('plugins', ['tmpl'])  

  .map('.login-panel', [ { controller: "LinkedInApp.LoginController" } ])
    
  .start();

