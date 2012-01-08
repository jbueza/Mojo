# Mojo - Lightweight Structural JavaScript Framework

Mojo is a patterns-based JavaScript framework that provides a consistent event- driven architecture for complex client-side web applications, built on existing best-of- breed JS libraries. Its objectives are to provide a structured way of developing Rich Internet Applications, abstract complexities by separation of concerns, and maximize re-use of existing code, in order to maintain knowledge and improve on speed and quality of deliverables.

Lightweight (4kb gzipped), provides you with structure, and is a great framework for building event-driven mobile web or desktop web applications for your distributed teams. The only dependency is jQuery (Sizzle) for its fast selector engine.


## Architecture

![Mojo Architecture](BlastMojo-NewArchitecture.png "Mojo Architecture")


## Get Started

[Download Mojo](https://github.com/jbueza/blastmojo/zipball/v0.1.5)

<pre>
  <code>var app = mojo.create({ baseSrc: 'js/' });       // Create a Mojo application instance

app
  .map('#login-example', function() {               // Map login-example as an implementation silo
    return [
      { controller: "ExampleApp.LoginController" }  // Bind controller(s) to login-example
    ];
  })

  .start()</code>
</pre>


## Get Started With Advanced Configuration

<pre>
  <code>var app = mojo.create({ baseSrc: 'js/' });

app
  .configure('locale', 'en_US')                   // locale aware applications! (load different languages)
  .configure('environment', 'prod')               // dev or prod for debugging mode!
  .configure('pluginSrc', 'js/lib/plugins/')      // setup plugins location directory
  .configure('plugins', ['jqmodal', 'jcarousel']) // automagically fetch my jQuery plugins!

  .map('#registration-example', function() {
    return [
      { controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }}
    ];
  })

  .map('#login-example', function() {
    return [
      { controller: "ExampleApp.LoginController" }
    ];
  })

  .start()</code>
</pre>

## Classes

* [Application](Application.html "Mojo: Application Class")
* [Controller](Controller.html "Mojo: Controller Class")
* [Core](Core.html "Mojo: Core Class")
* [Request](Request.html "Mojo: Request Class")
* [Service](Service.html "Mojo: Service Class")

## Guides

* [Mojo Architecture Overview](#)
* [Writing Your First Controller](#)
* [Using Dependency Injection With jQuery Plugins](#)

## Apache 2.0 License

Copyright 2012 Agile Business Cloud Solutions Ltd.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Contributions

Post patches to the [Mojo Mailing List](http://groups.google.com/group/blast-mojo) or provide a github pull request to [jbueza](https://github.com/jbueza/blastmojo).

* Discuss large changes on mailing list before coding
* Javascript code style
  * has two space indention
  * maximum 80 column width
  * keywords followed by open-paren must be separated by a space. eg. <code>if (condition)</code> not <code>if(condition)</code>
  * no space between function name and open paren e.g. <code>functionName(parameters)</code> not <code>functionName (parameters)</code>
  * multi-line <code>if</code> statements must have braces.
  * patches should all pass [JSLint](http://jslint.com)

## History

* Brought to you by the [Blast Radius](http://www.blastradius.com) Front-End Engineering Team
* Brought to you by [Jaime Bueza](http://jaime.bueza.com)
* Brought to you by [Agile Business Cloud](http://www.agilebusinesscloud.com)
* Brought to you by [RESAAS](http://www.resaas.com) Front-End Engineering Team