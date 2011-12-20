/* 
* Service
* @author Jaime Bueza
* Represents a service call
*/
mojo.define('mojo.Service', function Service() {
  var $ = jQuery;
  
  function Service(name, uri, options) {
    if (typeof options == 'undefined') options = {};

    var defaults = {
      method: options.method || function () {
        var type = "get";
        if (name.match(/^get/i)) {
          type = "get";
        } else if (name.match(/^add|del|update/i)) {
          type = "post";
        }
        return type;
        
        } (),
      jsonp: false,
      wcf: false,
      template: false
    };
    this.name = name;
    this.uri = uri;
    this.options = $.extend({}, defaults, options);
  };

  Service.prototype.invoke = function (params, callback, scope) {
    
    var self = this;
    
    var options = self.getOptions() || {},
                  method = options.method,
                  uri = self.getURI(),
                  responseType = options.responseType || 'JSON';

    if ('undefined' == typeof callback || !callback) throw new Error("'callback' is a required parameter");

    if (options.template) {
      uri = self.parse(uri, params);
      //blank out params now since they're already in the template
      //but only if it's an http GET
      if (method == 'get') params = null; 
      
    }

    $.ajaxSetup({
      dataTypeString: responseType,
      dataType: options.jsonp ? 'jsonp' : responseType,
      type: method,
      async: options.async || true,
      cache: options.cache || false,
      contentType: options.contentType || "application/json; charset=utf-8"
    });

    var data;
    if (method == 'post' && options.complex) {
      data = JSON.stringify(params);
    } else {
      data = params;
    }
   
    $.ajax({
      url: uri,
      data: data
    }).success(function (data) {
      if (responseType == 'JSON' && this.contentType.match(/javascript/g)) {
        data = $.parseJSON(data);
      }
      if ('undefined' != typeof callback) {
        if (typeof callback == 'function') {
          callback.call(scope, null, data);
        } else {
          //string
          scope[callback](null, data);
        }
      }
    }).error(function () {
      if ('undefined' != typeof callback) callback.call(scope || this, "Unable to execute XHR", arguments);
    });
  };
  
  Service.prototype.getName = function () {
    return this.name;
  };

  Service.prototype.getURI = function () {
    return this.uri;
  };

  Service.prototype.getOptions = function () {
    return this.options;
  };
  /*
   * Sets or Gets an option from a particular Service
   */
  Service.prototype.option = function () {
    if (!arguments.length) return false;
    if (arguments.length > 2) return false;
    if ('string' != typeof arguments[0]) return false;
    
    if (arguments.length == 2) {
      this.options[arguments[0]] = arguments[1];
      return this;
    } else if (arguments.length == 1) {
      return this.options[arguments[0]];
    }
  };

  /*
   * Returns an HTML fragment from {} templating
   * @deprecated
   */
  Service.prototype.parse = function (content, params) {
    if (arguments.length != 2) return false;
    if ('string' != typeof content) return false;
    if ('object' != typeof params) return false;
    $.each(params, function (key, value) {
      content = content.split("{" + key + "}").join(value);
    });
    return content;
  };

  window.mojo.Service = Service;
  if (window.MOJO) window.MOJO.Service = Service;
});