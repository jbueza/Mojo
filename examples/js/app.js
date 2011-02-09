var app = MOJO.create({ mojoSrc: '../src' });

app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')
  .configure('environment', 'dev')
  .configure('plugins', ['jqmodal', 'jcarousel'])

  
  .get('#test-example1', function() {
    return [
      { controller: "ExampleApp.Test1Controller", params: { user: 123, firstName: "Johnson" }}
    ];
  })

  .get('#test-example2', function() {
    return [
      { controller: "ExampleApp.LoginController", params: { user: 22, firstName: "Johnson" }}
    ];
  })
  
app.start()