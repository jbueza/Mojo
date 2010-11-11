# Blast Mojo Lite - Scalable JavaScript Framework

Blast Mojo Lite (BML) is a scalable JavaScript framework that has the ability to scale up and down based on how big your project is. The original inception of Blast Mojo (version one) was heroic and scaled extremely well on large deployments; however, using Blast Mojo was tough on small deployments (campaign work). In trying to keep the same structural essence of its predecessor, we're refactoring a lot of its core features into plugins. 

## Setup

1. git clone http://github.com/carynewfeldt/BlastMojoLite.git into your localhost 
1. use apache ant to build a compiled source
1. Navigate to http://localhost/BlastMojoLite/example/index.html for boilerplate code

## Why create another Framework?

Early 2007, Blast Mojo was born in order to:

* Provide a standard, consistent architecture for developing with JavaScript
* Work with different libraries without conflict
* Structure and organize JavaScript
* Enforce separation of concerns
* Ensure code can be shared and re-used


## Why use Mojolite?

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
* Provide capability to observe commands and custom events within the command
* Write unit tests for Binder using qunit
* [done] Ability to do dependency injection on jQuery plugins

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