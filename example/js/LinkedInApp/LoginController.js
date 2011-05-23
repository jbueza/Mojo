/* 
 * @class   LinkedIn Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('LinkedInApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']    
  ],
  methods: {
    Login: function(requestObj) {
      IN.User.authorize(function(response) {
        alert('Successfully logged into LinkedIn');
      }, this)
    },
    Logout: function(requestObj) {
      IN.User.logout(function() {
        alert('Successfully logged out of LinkedIn');
      }, this)
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