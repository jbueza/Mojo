Class('ExampleApp.Sitemap', {
    isa: 'Mojolite.Sitemap',
    has : {
        sitemap: {
            is: "ro",
            init: [
                { pattern: ".wrapper", attach: [
                    { binder: "ExampleApp.Click" }
                ]}
            ]
        }
    }
});
