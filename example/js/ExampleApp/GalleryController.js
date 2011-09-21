/*
 * Small example on how to use jquery plugins inside your
 * controllers
 *  
 * @class   Gallery Controller
 * @author  Jaime Bueza
 */
mojo.define('ExampleApp.GalleryController', {
  events: [
  
  ],
  methods: {

  },
  after: {
    Start: function() {
      //initialize!
      $("#mycarousel", this.getContextElement()).jcarousel();
    }
  }
});