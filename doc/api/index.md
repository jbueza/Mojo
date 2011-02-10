# Blast Mojo - Version 2 - Structural JavaScript Framework

Blast Mojo is a patterns-based JavaScript framework that provides a consistent event- driven architecture for complex client-side web applications, built on existing best-of- breed JS libraries. Its objectives are to provide a structured way of developing Rich Internet Applications, abstract complexities by separation of concerns, and maximize re-use of existing code, in order to maintain knowledge and improve on speed and quality of deliverables.

## Get Started

<pre>
  <code>//Start Here 
var app = MOJO.create({ mojoSrc: '../src' }); 

app
   .configure('appSrc', 'js/')
     //Bind a controller to an element
   .get('#registration-example', function() {
     return [
       { controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }}
     ];
   })
   .get('#login-example', function() {
     return [
       { controller: "ExampleApp.LoginController" }
     ];
   })
   .start()</code>
</pre>

## Get Started With Advanced Configuration

<pre>
  <code>var app = MOJO.create({ mojoSrc: '../src' });

app
  .configure('appSrc', 'js/')
  .configure('locale', 'en_US')                   // locale aware applications! (load different languages)
  .configure('environment', 'prod')               // dev or prod for debugging mode!
  .configure('pluginSrc', 'js/lib/plugins/')      // setup plugins location directory
  .configure('plugins', ['jqmodal', 'jcarousel']) // automagically fetch my jQuery plugins!

  .get('#registration-example', function() {
    return [
      { controller: "ExampleApp.RegistrationController", params: { user: 123, firstName: "Johnson" }}
    ];
  })

  .get('#login-example', function() {
    return [
      { controller: "ExampleApp.LoginController" }
    ];
  })

  .start()</code>
</pre>

## Classes

* [Application](Application.html "Blast Mojo: Application Class")
* [Command](Command.html "Blast Mojo: Command Class")
* [Controller](Controller.html "Blast Mojo: Controller Class")
* [Core](Core.html "Blast Mojo: Core Class")
* [Event Emitter](EventEmitter.html "Blast Mojo: Event Emitter Class")
* [Request](Request.html "Blast Mojo: Request Class")
* [Service](Service.html "Blast Mojo: Service Class")

## Contributions


## MIT License
<pre>/*!
   * The Blast Mojo Framework
   *
   * Copyright (c) 2011 Blast Radius
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   */
</pre>
