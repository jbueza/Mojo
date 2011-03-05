MOJO.define('Service', function() {
/* 
  @author       Jaime Bueza
  @description  Class representation of a web service call
  @dependencies jQuery
    
*/
function Service(name, uri, options) {
  if (typeof options == 'undefined' ) options = {};
  var defaults = { 
      method: options.method || function() {
        var type = "get";
          if (name.match(/^get/i)) {
            type = "get";
          } else if (name.match(/^add|del|update/i)) {
            type = "post";
          }
          return type;
      }()
    , template: false };
  this.name = name;
  this.uri = uri;
  
  this.options = $.extend({}, defaults, options);
};

Service.prototype.invoke = function(params, callback, scope) {
  var self = this;
  
  var options = this.getOptions() || {}
    , method = options.method
    , uri = self.getURI()
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
Service.prototype.option = function() {
  if (arguments.length > 1) {
    this.options[arguments[0]] = arguments[1];
  } else {
    return this.options[arguments[0]];
  }
};

window.Service = Service;
return Service;

});
