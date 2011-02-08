var app = MOJO.create({ mojoSrc: '../src' });

app
  .configure('appSrc', 'js')
  .configure('locale', 'en_US')
  .configure('environment', 'dev')
  .configure('plugins', ['jqmodal', 'jcarousel'])
  
  .get('#test-example1', function(app) {
    return [
      { controller: "ExampleApp.Test1Controller", params: { user: 123, firstName: "Johnson" }}
    ];
  })
/*
  .get('#test-example2', function(app) {
    return [
      { controller: "ExampleApp.Test2Controller", params: { user: 123, firstName: "Johnson" }}
    ];
  })
  .get('#test-example3', function(app) {
    return [
      { controller: "ExampleApp.Test3Controller", params: { user: 123, firstName: "Johnson" }}
    ];
  })
  .get('.reusable', function(app) {
    return [
        { controller: "ExampleApp.ReusableController", params: { user: 123, firstName: "Johnson" }}
      , { controller: "ExampleApp.CarouselController", params: { user: 222, firstName: "Jameson" }}
    ];
  })*/


app.start()