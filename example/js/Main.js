JooseX.Namespace.Depended.Manager.my.INC = ["js/"];    
JooseX.Namespace.Depended.Resource.JooseClass.meta.extend({
      does : [ JooseX.Namespace.Depended.Transport.ScriptTag ],
      doesnt: [ JooseX.Namespace.Depended.Transport.XHRAsync ]
  });
 use("Main", function() {new Main();});
 
 
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