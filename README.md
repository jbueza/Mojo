# Blast Mojo Lite - Scalable JavaScript Microframework

![Blast Mojo Lite Architecture](http://mojo.bueza.com/bml/architecture.png)

Blast Mojo Lite (BML) is a scalable JavaScript microframework that has the ability to scale up and down based on how big your project is. The original inception of Blast Mojo (version one) was heroic and scaled extremely well on large deployments; however, using Blast Mojo was tough on small deployments (campaign work) because of its heroic architecture, weight, and dependencies on Dojo. In trying to keep the same structural essence of its predecessor, we're refactoring its core features into jQuery plugins and using Joose's underlying dependency injection and aspect-oriented programming features.

A prime example of why you would want to use Blast Mojo Lite: you have a 4-6 person team of front-end developers. jQuery is a great library that encompasses a plethora of helper methods (animation, DOM manipulation, network IO) but it doesn't reinforce the concepts of writing code with structural integrity or implementation silos. Based on our agency experience having globally distributed teams, we found that using jQuery alone can quickly turn a project into a pile of spaghetti with developers hopping on and off the project.

The Blast Mojo Lite Initiative emerged to help distributed teams build web applications with a set of consistent APIs, implementation silos, loosely bound code, and structural integrity -- And finally, you get the awesomeness of jQuery in the palm of your hand because Blast Mojo Lite is built on top of it!

### Technical Features

* Not a heavyweight MVC framework, we tried that before with Blast Mojo v1
* Aspect-oriented programming for intercepting functionality (before, after, around) with Joose
* Dependency injection on any plugin (pull jQuery plugins into your application when you need them) with Joose
* Publish/Subscribe (by pulling in the pubsub plugin into your application sandbox)
* Use any other jQuery plugin (jqModal for dialogs, jcarousel for carousels, bbq for History, etc)
* Binders (controllers) are mapped to DOM elements to give components functionality
* Binders are used as a way of creating implementation silos (LoginBinder, RegistrationBinder, ChatBinder, NavigationBinder)

### Technical Benefits of being built on top of jQuery

Development teams are

* comfortable with jQuery syntax 
* comfortable with jQuery documentation 
* provided with a large community for support
* able to scale their projects effectively by pulling in jQuery plugins they need (no random features you don't need)
* able to use publish/subscribe by injecting the plugin into the application
* able to structure their code into Binders which essentially act as implementation silos

## Setup

1. git clone http://github.com/carynewfeldt/BlastMojoLite.git into your localhost 
1. cd BlastMojoLite and use apache ant to build a compiled source: <code>ant</code>
1. Navigate to http://localhost/BlastMojoLite/example/index.html for boilerplate code

## Why create another Framework?

Early 2007, Blast Mojo was born in order to:

* Provide a standard, consistent architecture for developing with JavaScript
* Work with different libraries without conflict
* Structure and organize JavaScript
* Enforce separation of concerns
* Ensure code can be shared and re-used


## Why use Blast Mojo Lite?

* Blast Mojo offers a foundation that other libraries and developers can take advantage of. It was built to provide a consistent architectural structure for development of small to massive projects allowing for code reuse and flexibility

* Enforces organization and clean separation of code to ease readability and maintainability

* Capability to pull any jQuery plugin for rapid prototyping and development
 
* Increases productivity of large teams working in parallel, particularly on Agile projects, by dividing work into implementation silos and allowing incremental development

* Reduces developer ramp-up time starting on new projects because they are already accustomed to the coding structures, patterns and practices

* Development speeds up as times goes on compared to the opposite that happens when code becomes too tightly bound

## Contributing

Post patches to the [Blast Mojo Mailing List](http://groups.google.com/group/blast-mojo)

* Discuss large changes on mailing list before coding
* Javascript code style
  * has two space indention
  * maximum 80 column width
  * keywords followed by open-paren must be separated by a space. eg. if (condition) not if(condition)
  * no space between function name and open paren e.g. functionName(parameters) not functionName (parameters)
  * multi-line if statements must have braces.
* patches should all pass [JSLint](http://jslint.com) 

## TODO

* Provide capability to reuse commands 
* Create more examples using different plugins
* Setup wiki on github
* Write unit tests for Binder using qunit
* [done] Ability to do dependency injection on jQuery plugins
* Need a much more simpler way of declaring binder->dom mappings. Look into sinatra style routes but for DOM. Kind of like this?

<pre><code>
  
  var app = new Mojo.Application({ locale: "en-US", mode: 'development' });

  app.map('#login-panel', function(params) {
    //callback upon instantiation that passes params into controller(s)
    return {
  
    }
  })
  .validate({ 'username': [ 'isRequired' ], 'password': [ 'isRequired' ])
  .bind('LoginController', 'CarouselController');
  
  //see MicroKernel: http://symfony2bundles.org/avalanche123/MicroKernelBundle
  //see Sinatra: http://www.sinatrarb.com/
  //see SammyJS: http://code.quirkey.com/sammy/
  
</code></pre>

## MIT Licence

The Blast Mojo Lite Framework

Copyright (c) 2010 Blast Radius

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.