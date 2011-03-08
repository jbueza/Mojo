/* 
  @author       Jaime Bueza
  @description  Class representation of a Kentico CMS web service call
                Kentico's ASMX (web services) wrap all responses in a "d" object
  @dependencies jQuery (ajax module), JSON
*/
MOJO.define('KenticoService', function() {

var KenticoService = Service;

KenticoService.prototype.invoke = function(params, callback, scope) {
  function stripslashes(str) {
    str = str.replace(/\\'/g,'\'');
    str = str.replace(/\\"/g,'"');
    str = str.replace(/\\0/g,'\0');
    str = str.replace(/\\\\/g,'\\');
    return str;
  }
  
  var self = this;
  
  var options = this.getOptions() || {}
    , method = options.method
    , uri = this.uri || '/api/user'
    , responseType = options.responseType || 'JSON';
    
  if (options.template) {
    uri = $.tmpl(uri, params);
    params = null;
  }
  $.ajaxSetup({
      dataTypeString: responseType
    , type: method
    , cache: options.cache || 'false'
    , contentType: options.contentType || "application/json; charset=utf-8"
  });

  if (method == 'post') {
    params = JSON.stringify(params);
  }
  $.ajax({ url: uri, data: params })
    .success(function(data) { 
      if ( typeof data == 'object' && responseType == 'JSON' ) { 
        data = data.d;
      } else if (typeof data == 'string' && responseType == 'JSON') {
        if (data.charAt(2) == 'd') {
          data = data.slice(6, -2); //.NET HACKERY!!!!
          data = stripslashes(data);
        }

      }
      
      if(options.contentType != 'text/html') data = $.parseJSON(data); 
        
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
      if ('undefined' != typeof callback) callback.call(scope, "Unable to execute XHR", arguments);
    });
};

window.KenticoService = KenticoService;
return KenticoService;

});
