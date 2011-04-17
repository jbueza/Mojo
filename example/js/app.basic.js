var app = MOJO.create({ baseSrc: 'js/' });

app
  .configure('pluginSrc', 'js/lib/plugins/')  
  .configure('plugins', ['jqmodal', 'jcarousel', 'pubsub'])

  .map('#login-example', [{ controller: "ExampleApp.LoginController" }])
  
  .start();



