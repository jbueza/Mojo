MOJO.define('ExampleApp.member.ProfileController', {
  events: [
    [ 'context', '.btn-save-profile', 'click', 'Save' ]
  ],
  methods: {
    Save: function(requestObj) {
      console.log(this);
      console.log("Saving profile...");
    }
  },
  after: {
    Start: function() {
      var context = this.contextElement;
      //prefill!
      $.each(this.params, function(key, value) {
        $("input[name='" + key + "']", context).val(value);
      });
    }
  }
});