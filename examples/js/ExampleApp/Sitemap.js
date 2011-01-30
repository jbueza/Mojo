Class('ExampleApp.Sitemap', { isa: 'mojo.Sitemap', has : { sitemap: {
  init: [ 
      { pattern: "#registration-example", attach: [ { binder: "ExampleApp.Registration" } ] }
    , { pattern: "#registration-example", attach: [ { binder: "ExampleApp.Registration" } ] }
    , { pattern: "#carousel-example", attach: [ { binder: "ExampleApp.Registration" } ] }
  ]
}}});
