Joose.Class('ExampleApp.BasicBinder', { isa: 'mojo.Binder',
  has: {
    __eventMap: { init: [
      ['context', "img", 'click', 'Alert']
    ]}
  },
  methods: {
    Alert: function(event) {
      alert("You clicked me!");
      
      return false;
    }
  },
  after: {
    initialize: function(props) {
      // You can put 3rd party based binding of events here if you do not want to use __eventmap.
    }
  }
});