mojo.define('ExampleApp.BlogsController', {
  events: [],
  methods: {},
  after: {
    Start: function() {
      var context = this.getContextElement();
      window.renderBlogs = function(data) {

        $('#blogTemplate').tmpl(data.Items).appendTo("ul.blogs", context);
        
      }
      mojo.ServiceLocator.getService('GetSXPBlogs').invoke({
          MediaType: 0
        , SubMediaType: 0
        , pageSize: 3
        , jsonp: "renderBlogs" 
      });
    }
  }
})