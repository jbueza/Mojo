/* 
  @author       Jaime Bueza
  @description  Provides inversion of control on restful web apps by using
                the service locator pattern. Frontend service locator needs to be
                browser compatible so we use only GET/POST for web services.
  @dependencies
    - jQuery (John Resig)


      TODO: JOOSEIFY THIS!


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
  
function Service(name, uri, options) {
  this.name = name;
  this.uri = uri;
  this.options = options;
};

Service.prototype.invoke = function(params, callback, scope) {

  var self = this;
  
  var options = this.getOptions() || {}
    , method = options.method || function() {
      var type = "get";
      
      if (self.getName().match(/^get/i)) {
        type = "get";
      } else if (self.getName().match(/^add|del|update/i)) {
        type = "post";
      }
      return type;
    }()
    , uri = this.uri || '/api'
    , responseType = options.responseType || 'JSON';
    
  if (options.template) {
    uri = $.tmpl(uri, params);
    params = null;
  }
  
  $.ajaxSetup({
      dataTypeString: responseType
    , type: method
    , cache: options.cache || 'false'
    , contentType: "application/json; charset=utf-8"
  });

  $.ajax({ url: uri, data: params })
    .success(function(data) { 
      if ( responseType == 'JSON' ) { 
        data = $.parseJSON(data); 
      }
        
      if ( typeof callback == 'function' ) {
        callback.call(scope, null, data);
      } else {
        //string
        scope[callback](null, data);
      }        
    })
    .error(function() {
      callback.call(scope, "Unable to execute XHR", arguments);
    });


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
    return this;
  },
  getService: function(name) {
    return this.services[name];
  },
  removeService: function(name) {
    delete this.services[name];
  },
  removeServices: function() { 
    this.services = {}; 
  }
};
