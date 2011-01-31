Class('ExampleApp.Sitemap', { isa: 'mojo.Sitemap', has : { sitemap: {
  init: [ 
      { pattern: "#registration-example", attach: [ { binder: "ExampleApp.RegistrationBinder" } ] }
    , { pattern: "#basic-example", attach: [ { binder: "ExampleApp.BasicBinder" } ] }
    , { pattern: "#carousel-example", attach: [ { binder: "ExampleApp.CarouselBinder" } ] }
  ]
}}});
