Joose.Class('ExampleApp.CarouselBinder', { isa: 'mojo.Binder',

  methods: {
    
  },
  after: {
    initialize: function(props) {
      $(this.$$context).jcarousel();
    }
  }
});