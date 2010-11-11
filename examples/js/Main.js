JooseX.Namespace.Depended.Manager.my.INC = ["js/"];    
JooseX.Namespace.Depended.Resource.JooseClass.meta.extend({
  does : [ JooseX.Namespace.Depended.Transport.ScriptTag ],
  doesnt: [ JooseX.Namespace.Depended.Transport.XHRAsync ]
});

//Basic Example: basic.html
use("Basic", function() {
  new Basic();
});
Joose.Class("Basic", {
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

//jQuery Plugin - Carousel Example: carousel.html
use("Carousel", function() {
  new Carousel();
});
Joose.Class("Carousel", {
  trait: 'JooseX.Class.Singleton',
  //you'll notice here you can include plugins through dependency injection
  use : ['lib.plugins.jcarousel', 'lib.plugins.pubsub'],
  has: {},
  after: {
    initialize: function(props) {
      $(document).ready(function() {
          $('#mycarousel').jcarousel();
      });
      
    }
  },
  methods : {}
});