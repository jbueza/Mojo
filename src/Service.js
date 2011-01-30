/* 
  @author       Jaime Bueza
  @description  Provides inversion of control on restful web apps by using
                the service locator pattern. Frontend service locator needs to be
                browser compatible so we use only GET/POST for web services.
  @dependencies
    - jQuery (John Resig)



  //Setup your services so your frontend can invoke any service at any time
  ServiceLocator.addService(new Service('GetUsers',   '/users', { method: 'get' }));
  ServiceLocator.addService(new Service('AddUser',    '/user/create', { method: 'post' }));
  ServiceLocator.addService(new Service('UpdateUser', '/user/update', { method: 'post' }));
  ServiceLocator.addService(new Service('DeleteUser', '/user/delete', { method: 'post' }));
  
  ServiceLocator.addService(new Service('GetUser',   '/users/${id}', { method: 'get', template: true }));

  //click handler on get users
  var User = {
    render: function(response) {
      //$("#userView").html(response); //for html based responses.
      $("#userTemplate").tmpl(response).appendTo("#view"); //for jq tmpl json responses
    }
  };
  
  $("#btn-get-users").click(function() {
    ServiceLocator.getService('GetNotes').invoke({}, "render", User);
  });
  
*/

(function( $ ) {
  
  var Service = function(name, uri, options) {
    this.name = name;
    this.uri = uri;
    this.options = options;
  };

  Service.prototype.invoke = function(params, callback, scope) {
    var options = this.getOptions()
      , method = options.method || 'get'
      , uri = this.uri || '/api/user'
      , responseType = options.responseType || 'JSON';
      
    if (options.template) {
      uri = $.tmpl(uri, params);
      params = null;
    }
    
    $.ajaxSetup({
      //contentType: "application/json; charset=utf-8"
    });
    
    $[method](uri, params, function(data) {
      
      if ( typeof data == 'string' && responseType == 'JSON' ) data = $.parseJSON(data);
      
      if ( typeof callback == 'function' ) {
        callback.call(scope, data);
      } else {
        //string
        scope[callback](data);
      }
      
    }, responseType);

  };

  Service.prototype.getName = function() {
    return this.name;
  };
  Service.prototype.getURI = function() {
    return this.uri;
  };
  Service.prototype.getOptions = function() {
    return this.options;
  };


  /*
   * @author        Jaime Bueza
   * @description   Provides a singleton that we can access to fetch services for invocation
   * @class         ServiceLocator
   */
  var ServiceLocator = {
    services: {},
    addService: function(service) {
      this.services[service.name] = service;
    },
    getService: function(name) {
      return this.services[name];
    },
    removeService: function(name) {
      delete this.services[name];
    },
    addServices: function() {},
    removeServices: function() { 
      this.services = {}; 
    }
  };
  
  
  if(!window.Service || !window.ServiceLocator) {
    window.Service = Service;
    window.ServiceLocator = ServiceLocator;
  } else {
    throw new Error("Unable to seed Service/ServiceLocator into window object.");
  }


})( $ );