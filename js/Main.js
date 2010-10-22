Joose.Class("Main", {
        trait: 'JooseX.Class.Singleton',
        use : ['ExampleApp.Sitemap'],
        has: {
            sitemap: { init: function() { return new ExampleApp.Sitemap(); } }
        },
        after: {
            initialize: function(props) {
                this.sitemap.bindSitemap();
            }
        },
        methods : {}
    });