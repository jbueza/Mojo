Joose.Class('ExampleApp.Click', {
  isa: 'mojo.Binder',
  has: {
  // This is required if you are to bind events the 'mojolite way' 
    __eventMap: {init: [['context', "", 'click', 'testClick']]}
  },
  methods: {
    testClick: function(e) {
      alert("Hello there!");
      return false;
    }
  },
  after: {
    initialize: function(props) {
      // You can put 3rd party based binding of events here if you do not want to use __eventmap.
    }
  }
});