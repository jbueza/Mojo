/* 
* Service
* @author Jaime Bueza
* Represents a service call
*/
mojo.define('mojo.Service', function Service($) {
  
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
      wrapped: false,
      template: false,
      contentType: "application/json; charset=utf-8"
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
    if (method == 'post' && options.contentType.match(/application\/json/gi)) {
      data = JSON.stringify(params);
    } else {
      data = params;
    }

    $.ajax({
      url: uri,
      data: data,
      headers: {
        "RequestId": mojo.guid()
      }
    }).success(function (data) {
      if (responseType == 'JSON' && this.contentType.match(/javascript/g)) {
        data = $.parseJSON(data);
      }
      
      if (options.wrapped) data = self.unwrap(data);

      if ('undefined' != typeof callback) {
        var args = [ null, data, arguments[1], arguments[2] ];
        if (typeof callback == 'function') {
          callback.apply(scope, args);
        } else {
          //string
          scope[callback].apply(scope, args);
        }
      }
    }).error(function () {
      if ('undefined' != typeof callback) {
        callback.apply(scope || this, arguments);
      }
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

  Service.prototype.unwrap = function (data) {
    var self = this;
    var unwrapped = {};
    for (var prop in data) {
      if (typeof prop === 'string' && prop.substr(prop.length - 6, prop.length) == 'Result') {
        data = self.convert(data[prop]);
        break;
      }
    }
    return data;
  };

  Service.prototype.convert = function (o) {
    var newResult = {};
    for (var rootProp in o) {
      newResult[rootProp] = o[rootProp];
    }
    return newResult;
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
  * @param context {String} Accepts any length string with mustaches ({myKey})
  * @param params {Object} A JSON object that is ran against the content string that has mustaches
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

  mojo.Service = Service;
});