JooseX.Namespace.Depended.Manager.my.INC = ["js/"];    
JooseX.Namespace.Depended.Resource.JooseClass.meta.extend({
  does : [ JooseX.Namespace.Depended.Transport.ScriptTag ],
  doesnt: [ JooseX.Namespace.Depended.Transport.XHRAsync ]
});

//jQuery Plugin - Carousel Example: carousel.html
use("CarouselApplication", function() {
  new CarouselApplication();
});
Joose.Class("CarouselApplication", {
  trait: 'JooseX.Class.Singleton',
  //you'll notice here you can include plugins through dependency injection
  use : ['ExampleApp.Sitemap', 'lib.plugins.jcarousel'],
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

