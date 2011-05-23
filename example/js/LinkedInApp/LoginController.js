/* 
 * @class   LinkedIn Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('LinkedInApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout'] 
    , ['context', '.btn-fetch-profile', 'click', 'FetchProfile']
  ],
  methods: {
    FetchProfile: function(requestObj) {
      IN.API.Profile("me")
        .result(function(result) {
          result = result.values[0];

          $( "#profileTemplate" ).tmpl( result ).appendTo( ".profile-info" );

        });
    },
    Login: function(requestObj) {
      
      var self = this;
      IN.User.authorize(function(response) {
        console.log("Logged into LinkedIn");
        self.FetchProfile();
      }, this);
    },
    Logout: function(requestObj) {
      IN.User.logout(function() {
        console.log('Successfully logged out of LinkedIn');
      }, this);
    }
  },
  after: {
    Start: function() {
      //Initialization
      IN.Event.onOnce(IN, 'auth', function() {
        MOJO.Messaging.publish("/linkedin/user/login");
      }, this, {});
      IN.Event.onOnce(IN, 'logout', function() {
        MOJO.Messaging.publish("/linkedin/user/logout");
      }, this, {});
      
      
    }
  }
});