# Application

<pre><code>//MOJO.create() returns you an application instance.
var app = MOJO.create();</code></pre>

## API

### configure(key, value) 

Provides the ability to set configurations for your Mojo application. At the moment, there are the following options:

#### Options

* appSrc - Where your primary JS directory is. Defaults to "js/"
* locale - Localization of your application (this is for future use when you choose to go international)
* plugins - Choose your favourite jQuery plugins, the application will automatically inject them for you
* pluginSrc - Path to your plugins directory. Defaults to "js/lib/plugins/"

#### Usage

<pre><code>app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')                   // locale aware applications! (load different languages)
  .configure('environment', 'prod')               // dev or prod for debugging mode!
  .configure('pluginSrc', 'js/lib/plugins/')      // setup plugins location directory
  .configure('plugins', ['jqmodal', 'jcarousel']) // automagically fetch my jQuery plugins!</code></pre>

### get(selector, callback) 

Provides the ability to map a particular DOM element (through css selector) to a controller or a number
of controllers by returning an array of Controller objects. 

* selector - {String|DOM} CSS Selector or HTML Element
* callback - {Function} Executes a callback that returns an array of Controller objects that you wish to map to this particular DOM element

### heal()

Provides the ability to self-heal any broken depenencies (missing plugins, utilities, core components, or even application-specific controllers).

### setupController(context, controller, params) 

Provides a reusable private method for mapping controllers to 'context' (DOM elements), as well as, pass the a key:value parameter object into the controller upon instantiation. Developers should not be calling this method directly, as it is already used by 'connectControllers()'.

### disconnectControllers(onComplete)

Provides the ability to unbind all controllrers from all contexts, as well as, provides your application with an onComplete callback.

### connectControllers()

Provides the ability to map all DOM elemenets to Controllers based on your bootstrap JavaScript file (typically called app.js). Developers can call this if they (for some reason) want to remap controllers--This isn't recommended as you can use event delegation instead through your Event Map.

### on(eventName, callback) 

N/A (Future)

### getPlugins(onComplete)

Provides the ability to fetch all application-specific plugins prior to starting the application. This method piggybacks off of MOJO.require() to fetch the plugins.

### start()

Starts your application by binding all DOM contexts to controllers and connecting all commands to controllers.