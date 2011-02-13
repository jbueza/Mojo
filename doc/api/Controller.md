# Controller

An abstract class used in implementing Mojo Controllers. A Controller is an object that encapsulates all event handling, dispatching and intercepting in a Mojo application.

## API

### onInit()

Event triggered when Controller initialization completes.

### initialize(context, controllerName, paramsObj)

Setups up bindings from its events map.

### getContextElement()

Returns the DOM element that the current controller is bound to

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