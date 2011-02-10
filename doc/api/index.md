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

