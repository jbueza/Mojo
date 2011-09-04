/* 
  @author       Jaime Bueza
  @description  Class representation of a web service call
  @dependencies jQuery  
*/
MOJO.define('Service', function() {

"use strict"; 

var $ = jQuery;

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
    , jsonp: false
    , template: false };
  this.name = name;
  this.uri = uri;
  
  this.options = $.extend({}, defaults, options);
};

/* 
 * @param params {Object} Hash representation of request parameters to be sent along in this service request
 * @param callback {Function} Callback to be invoked when the request finishes
 * @param scope {Object} Execution context for callback binding
 */
Service.prototype.invoke = function(params, callback, scope) {
  var self = this;
  
  var options = self.getOptions() || {}
    , method = options.method
    , uri = self.getURI()
    , responseType = options.responseType || 'JSON';
    
  if (options.template) {
    uri = self.parse(uri, params);
    if (method == 'get') params = null; //blank out params now since they're already in the template
                                        //but only if it's an http GET
  }
  
  $.ajaxSetup({
      dataTypeString: responseType
    , dataType: options.jsonp ? 'jsonp' : ''
    , type: method
    , async: options.async || 'true'
    , cache: options.cache || 'false'
    , contentType: options.contentType || "application/json; charset=utf-8"
  });
  
  $.ajax({ url: uri, data: params })
    .success(function(data) { 
      if ( responseType == 'JSON' && this.contentType.match(/javascript/g)) { 
        data = $.parseJSON(data); 
      }

      if ( 'undefined' != typeof callback ) {
        if ( typeof callback == 'function' ) {
          callback.call(scope, null, data);
        } else {
          //string
          scope[callback](null, data);
        }
      }
  
    })
    .error(function() {
      if ( 'undefined' != typeof callback ) callback.call(scope, "Unable to execute XHR", arguments);
    });
};

/* 
 * Returns the name of the service
 */
Service.prototype.getName = function() {
  return this.name;
};
/*
 * Returns the uri of the service
 */
Service.prototype.getURI = function() {
  return this.uri;
};
/*
 * Returns the options that were set upon service instantiation
 */
Service.prototype.getOptions = function() {
  return this.options;
};
/*
 * Sets or Gets an option of the current Service
 */
Service.prototype.option = function() {
  if (arguments.length > 1) {
    this.options[arguments[0]] = arguments[1];
    return this;
  } else {
    return this.options[arguments[0]];
  }
};

/* 
 * Provides a helper function for quick templating of RESTful urls
 * eg/ http://mysite.com/api/user/123
 */
Service.prototype.parse = function(content, params) {
  $.each(params, function(key, value) {
    content = content.split("{" + key + "}").join(value);
  });
  return content;
};

window.Service = Service;
return Service;

});
