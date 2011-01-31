JooseX.Namespace.Depended.Manager.my.INC = ["js/"];    
JooseX.Namespace.Depended.Resource.JooseClass.meta.extend({
  does : [ JooseX.Namespace.Depended.Transport.ScriptTag ],
  doesnt: [ JooseX.Namespace.Depended.Transport.XHRAsync ]
});

//jQuery Plugin - Carousel Example: carousel.html
use("RegistrationApplication", function() {
  new RegistrationApplication();
});
Joose.Class("RegistrationApplication", {
  trait: 'JooseX.Class.Singleton',
  use : ['ExampleApp.Sitemap'],
  has: {
    sitemap: { 
      init: function() { return new ExampleApp.Sitemap(); } 
    }
  },
  after: {
    initialize: function(props) {
      this.sitemap.bindSitemap();
    }
  },
  methods : {}
});