Joose.Class('ExampleApp.Registration', { isa: 'mojo.Binder',
  has: {
    __eventMap: { init: [
      ['context', "", 'click', 'testClick']
    ]}
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