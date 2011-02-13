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

## Basic Usage 


### 1. Setup your service registry for your application

<pre><code>
ServiceLocator.addService(new Service('GetUsers',     '/users'));
ServiceLocator.addService(new Service('AddFollower',  '/user/follow'));
ServiceLocator.addService(new Service('UpdateUser', '/user/update'));
ServiceLocator.addService(new Service('GetUser',   '/users/${id}', { template: true }));
</code></pre>

### 2. Invoke your services through a click

<pre><code>//Super basic example of using the Service Locator
$("#btn-follow-user").click(function(event) {
  ServiceLocator.getService('AddFollower').invoke({ userId: $(this).data('userId') }, function(err, data) {
    //success!
  });
});
</code></pre>