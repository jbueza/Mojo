/*
 * Small example on how to use jquery plugins inside your
 * controllers
 *  
 * @class   Gallery Controller
 * @author  Jaime Bueza
 */
mojo.define('ExampleApp.GalleryController', function($) {
  var Controller = {
    methods: {
      Initialize: function() {
        $("#mycarousel", this.getContextElement()).jcarousel();
      }
    }
  };
  return Controller;
});