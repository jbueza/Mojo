mojo.ServiceLocator.addService(new mojo.Service('GetUserProfile', 'data/success.json'));

var app = mojo.create({ baseSrc: 'js/' });

app
  .configure('appName', 'LinkedInApp')
  .configure('environment', 'dev')
  .configure('pluginSrc', 'js/lib/plugins/')
  .configure('plugins', ['tmpl'])  

  .map('.login-panel', [ { controller: "LinkedInApp.LoginController" } ])
    
  .start();

