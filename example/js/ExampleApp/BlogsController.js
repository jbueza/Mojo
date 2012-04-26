/*
 * An example of using JSONP with the Mojo Service Locator
 *  
 * @class   Blogs Controller
 * @author  Jaime Bueza
 */
mojo.define('ExampleApp.BlogsController', function($) {
  var Controller = {
    methods: {
      Initialize: function() {
        window.renderBlogs = function(data) {
          mojo.Model.set('ms.blogs', data);
        };
        mojo.ServiceLocator.getService('GetSXPBlogs').invoke({
            MediaType: 0
          , SubMediaType: 0
          , pageSize: 10
          , jsonp: "renderBlogs" 
        }, function(err, data) {
          console.log("Loading Complete!");
        });
      }
      
    }
  };
  
  return Controller;
});