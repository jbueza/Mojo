/*
 * Small example on how to use jquery plugins inside your
 * controllers
 *  
 * @class   Gallery Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.GalleryController', {
  events: [
  
  ],
  methods: {

  },
  after: {
    Start: function() {
      console.log(this);
      //initialize!
      $("#mycarousel", this.getContextElement()).jcarousel();
    }
  }
});