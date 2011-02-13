# Controller

Controller is an implementation silo that binds to a DOM element or a number of DOM elements. 

## API

### initialize(context, controllerName, paramsObj)

### getContextElement()

### intercept(when, callback, callbackInterceptor, paramsObj)


## Basic Usage

This is a basic example of how to create a Controller (implementation silo). 

<pre><code>/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
  ],
  methods: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  }
});</code></pre>


## Advanced Usage

Leverage Aspect-Oriented Programming (provide advice to aspects before or after).

<pre><code>/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
  ],
  methods: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  },
  before: {
    Login: function(requestObj) {
      console.log("[intercept] before Login");
    }
  },
  after: {
    Start: function() {
      //do some initialization here
    },
    Login: function(requestObj) {
      console.log("[intercept] after Login");
    }
  }
});</code></pre>