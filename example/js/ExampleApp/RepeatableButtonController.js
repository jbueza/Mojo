MOJO.define("RepeatableButtonController", {
  events: [
    ['context', '.btn-repeatable-button', 'click', 'Action']
  ],
  methods: {
    Action: function(requestObj) {
      requestObj.getEvent().preventDefault();
      
      console.log(requestObj);
      
    }
  },
  after: {
    Start: function() {
      
    }
  }
});