Joose.Singleton('Mojolite.Messaging', {
  trait: 'JooseX.Class.Singleton',
  has: {
    _eventGroup: {}
  },
  methods : {
    publish: function(eventName, handler, data) {
      console.log("Publishing Event");
    },
    unsubscribe: function(eventName, handler) {
      console.log("Unsubscribing to Event: ", eventName);
    },
    subscribe: function(eventName, data, context) {
      console.log("Subscribing to Event: " , eventName);
    }
  },
  after: {
    initialize: function() {
      console.log("Afterwards");
    }
  }
});
