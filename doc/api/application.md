# Application


## API

### configure(key, value) 

Provides the ability to set configurations for your Mojo application. At the moment, there are the following options:

* appSrc - Where your primary JS directory is. Defaults to "js/"
* locale - Localization of your application (this is for future use when you choose to go international)
* plugins - Choose your favourite jQuery plugins, the application will automatically inject them for you
* pluginSrc - Path to your plugins directory. Defaults to "js/lib/plugins/"

### get(selector, callback) 

