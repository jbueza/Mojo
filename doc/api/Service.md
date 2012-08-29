# Service

Class representation of a web service call.

## API

### invoke(params, callback, scope) 

Invokes the service by passing parameters, as well as, a callback with an execution context. The execution context defaults to the method that was originally invoked.

### getName() 

Returns the name of the web service. Example: "GetUser".

### getURI()

Returns the location of the web service. Example: "/api/user/create".

### getParams()

Returns the options that were originally set upon creation of the web service.

# Service Locator

The service locator is a singleton that serves as a registry for your web service calls. This would allows you easily
invoke services at different endpoints without changing service URLs in several different places in the application ( 
[Service Locator Pattern from java.sun.com](http://java.sun.com/blueprints/corej2eepatterns/Patterns/ServiceLocator.html) ).

## Basic Usage 

### 1. Setup your service registry for your application

```
mojo.ServiceLocator.addService(new mojo.Service('GetUsers',     '/users'));
mojo.ServiceLocator.addService(new mojo.Service('AddFollower',  '/user/follow'));
mojo.ServiceLocator.addService(new mojo.Service('UpdateUser', '/user/update'));
mojo.ServiceLocator.addService(new mojo.Service('GetUser',   '/users/${id}', { template: true }));
```

### 2. Invoke your services through a click

<pre><code>//Super basic example of using the Service Locator
$("#btn-follow-user").click(function(event) {
  mojo.ServiceLocator.getService('AddFollower').invoke({ userId: $(this).data('userId') }, function(err, data) {
    //success!
  });
});
</code></pre>


## Messaging

```javascript
mojo.Messaging.subscribe("mojo.Service.AddFollower", function(event, message) {
  console.log("we are now able to see messages being passed when the service is invoked");
  // this can make it easier for headless testing as you can just subscribe to the topics
  // instead of crafting callbacks to pass into the Service.
})
```