Joose.Class('ExampleApp.RegistrationBinder', { isa: 'mojo.Binder',
  has: {
    __eventMap: { init: [
      //['context', "", 'submit', 'testClick']
    ]}
  },
  methods: {
    Validate: function(e) {
      return false;
    }
  },
  after: {
    initialize: function(props) {
      // You can put 3rd party based binding of events here if you do not want to use __eventmap.
    }
  }
});