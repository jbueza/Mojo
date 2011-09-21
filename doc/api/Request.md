# Request

Class representation of an object being passed into all controller methods, typically called
requestObj. This object contains the eventObj, paramsObj, as well as, invocation.

## API


### getController() 

Returns the current controller that the request is bound to.

<pre>
  <code>Login: function(requestObj) {
    var myController = requestObj.getController();
  }</code>
</pre>

### getContextElement()

Returns the element that the current controller is bound to. Alternatively, within a controller method, you can just call <code>this.getContextElement()</code>.

### getCaller()

Returns the object that originally invoked it.

### getEvent()

Returns the event object during the request.

## Basic Usage

<pre>
  <code>mojo.define('ExampleApp.LoginController', {
    events: [
        ['context', '.btn-login', 'click', 'Login']
    ],
    methods: {
      Login: function(requestObj) {
        //you can use this.getContextElement();
        //or through the requestObj
        var context = requestObj.getContextElement();
        var event = requestObj.getEvent();
        var params = requestObj.getParams();
      }
    }
  });</code>
</pre>