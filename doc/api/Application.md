# Application

```javascript
//mojo.create() returns you an application instance.
var app = mojo.create();
```

## API

### configure(key, value) 

Provides the ability to set configurations for your Mojo application. At the moment, there are the following options:

#### Options

* appSrc - Where your primary JS directory is. Defaults to "js/"
* locale - Localization of your application (this is for future use when you choose to go international)
* plugins - Choose your favourite jQuery plugins, the application will automatically inject them for you
* pluginSrc - Path to your plugins directory. Defaults to "js/lib/plugins/"

#### Usage

```javascript
app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')                   // locale aware applications! (load different languages)
  .configure('environment', 'prod')               // dev or prod for debugging mode!
  .configure('pluginSrc', 'js/lib/plugins/')      // setup plugins location directory
  .configure('plugins', ['jqmodal', 'jcarousel']) // automagically fetch my jQuery plugins!
```

### map(selector, callback) 

Provides the ability to map a particular DOM element (through css selector) to a controller or a number
of controllers by returning an array of Controller objects. 

* selector - {String|DOM} CSS Selector or HTML Element
* callback - {Function} Executes a callback that returns an array of Controller objects that you wish to map to this particular DOM element

### setupController(context, controller, params) 

Provides a reusable private method for mapping controllers to 'context' (DOM elements), as well as, pass the a key:value parameter object into the controller upon instantiation. Developers should not be calling this method directly, as it is already used by 'connectControllers()'.

### disconnectControllers(onComplete)

Provides the ability to unbind all controllers from all contexts, as well as, provides your application with an onComplete callback.

### connectControllers()

Provides the ability to map all DOM elements to Controllers based on your bootstrap JavaScript file (typically called app.js). Developers can call this if they (for some reason) want to remap controllers--This isn't recommended as you can use event delegation instead through your Event Map.

### start()

Starts your application by binding all DOM contexts to controllers and connecting all commands to controllers.