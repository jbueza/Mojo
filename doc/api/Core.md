# Controller

An abstract class used in implementing Mojo Controllers. A Controller is an object that encapsulates all event handling, dispatching and intercepting in a Mojo application.

## API

### onInit()

Event triggered when Controller initialization completes.

### initialize(context, controllerName, paramsObj)

Setups up bindings from its events map.

### getContextElement()

Returns the DOM element that the current controller is bound to
