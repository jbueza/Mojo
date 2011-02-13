# Controller

Controller is an implementation silo that binds to a DOM element or a number of DOM elements. 

## API

### initialize(context, controllerName, paramsObj)

### getContextElement()

### intercept(when, callback, callbackInterceptor, paramsObj)


## Usage

<pre><code>/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
  ],
  commands: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  }
});</code></pre>