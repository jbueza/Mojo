Class('ExampleApp.Sitemap', {
  isa: 'Mojolite.Sitemap',
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
