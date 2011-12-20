mojo.define('ExampleApp.BlogsController', {
  events: [],
  methods: {},
  after: {
    Start: function() {
      window.renderBlogs = function(data) {
        mojo.Model.set('ms.blogs', data);
      }
      mojo.ServiceLocator.getService('GetSXPBlogs').invoke({
          MediaType: 0
        , SubMediaType: 0
        , pageSize: 3
        , jsonp: "renderBlogs" 
      }, function(err, data) {
        console.log("Complete!")
      });
    }
  }
})