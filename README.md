[![Build Status](https://travis-ci.org/jbueza/Mojo.png?branch=v1.2)](https://travis-ci.org/jbueza/Mojo)

# Mojo - JavaScript Microframework

Microframework on top of jQuery.

### Building From Source

<pre>
  $ git clone git@github.com:AgileBusinessCloud/Mojo.git &amp;&amp; cd Mojo
  $ ant
</pre>

## Getting Setup

1. git clone http://github.com/jbueza/Mojo.git && cd Mojo
2. use apache ant to build a compiled source: <code>ant</code>
3. navigate to the <code>/example</code> to view the example code

### app.js: Maps elements to Controllers

``` javascript
var app = mojo.create({ baseSrc: 'js/' });

app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')                   // locale aware applications! (load different languages)
  .configure('environment', 'prod')               // dev or prod for debugging mode!
  .configure('pluginSrc', 'js/lib/plugins/')      // setup plugins location directory
  .configure('plugins', ['jqmodal', 'jcarousel']) // automagically fetch my jQuery plugins!

  .map('#registration-example', [{ controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }} ])

  .map('#login-example', [{ controller: "ExampleApp.LoginController" }])

  .start()
```

### mysite/User/RegistrationController.js

```javascript

/*
 * Registration Controller
 */
mojo.define("mysite.User.RegistrationController", function($) {
  var Controller = {
    methods: {
      
    },
    events: []
  };
  
  return Controller;
});
```

For more information, view the [Quick Screencast of Mojo Framework](http://vimeo.com/22070574)

### Technical Features

* AOP
* Light Dependency Management
* PubSub
* Controllers (Implementation Silos)

## Why use Mojo?

* Mojo offers a foundation that other libraries and developers can take advantage of. It was built to provide a consistent architectural structure for development of small to massive projects allowing for code reuse and flexibility

* Enforces organization and clean separation of code to ease readability and maintainability

* Capability to pull any jQuery plugin for rapid prototyping and development
 
* Increases productivity of large teams working in parallel, particularly on Agile projects, by dividing work into implementation silos and allowing incremental development

* Reduces developer ramp-up time starting on new projects because they are already accustomed to the coding structures, patterns and practices

* Development speeds up as times goes on compared to the opposite that happens when code becomes too tightly bound

## Contributing

* Discuss large changes on Issues View before coding
* Javascript code style
  * has two space indention
  * maximum 80 column width
  * keywords followed by open-paren must be separated by a space. eg. if (condition) not if(condition)
  * no space between function name and open paren e.g. functionName(parameters) not functionName (parameters)
  * multi-line if statements must have braces.
* patches should all pass [JSLint](http://jslint.com) 

## Apache 2.0 License

Copyright 2012 Jaime Bueza

Copyright 2012 Agile Business Cloud Solutions Ltd.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
