Class('ExampleApp.Sitemap', {
  isa: 'mojo.Sitemap',
  has : {
    sitemap: {
      is: "ro",
        init: [ { 
          pattern: ".wrapper .testButton img", attach: [
            { binder: "ExampleApp.Click" }
          ]
        }]
      }
    }
});
