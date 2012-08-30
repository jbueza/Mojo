mojo.define('ExampleApp.member.ProfileController', {
  events: [
    [ 'context', '.btn-save-profile', 'click', 'Save' ]
  ],
  methods: {
    Initialize: function() {
      
      mojo.Messaging.subscribe("mojo.Service.getUpdateProfile", function(event, message) {
        console.log(message);
      });
    },
    Save: function(requestObj) {  
      var params = {};
      $("input[type=text], textarea").each(function(i, input) {
        input = $(input);
        params[input.attr('name')] = input.val();
      });
      mojo.ServiceLocator.getService('getUpdateProfile').invoke(params, function(err, data) {
        console.log("Success!");
        $(".success", this.getContextElement()).show('fast');
      }, this);
    }
  },
  after: {
    Start: function() {
      var self = this;
      $.each(this.params, function(key, value) {
        $("input[name='" + key + "']", self.getContextElement()).val(value);
      });
    }
  }
});