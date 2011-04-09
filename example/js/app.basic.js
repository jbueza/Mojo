var app = MOJO.create({ baseSrc: 'js/' });

app
  .configure('appName', 'ExampleApp')
  .configure('locale', 'en_US')
  .configure('environment', 'dev')
  .configure('pluginSrc', 'js/lib/plugins/')  
  .configure('plugins', ['jqmodal', 'jcarousel', 'pubsub'])

  .map('#login-example', [{ controller: "ExampleApp.LoginController" }])

  
  .start();



