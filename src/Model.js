mojo.define("mojo.Model", function() {

"use strict";

var $ = jQuery, Model = function() {};
  
Model.set = function(key, value) {
  //find in the DOM, if it's an element, pass it into the templating engine
  //if it's not an HTML element, then we can just store it in DOM
  var models = mojo.query('*[modelSource="' + key + '"]'),
      contentOfModel;
  
  //makes an assumption that there is only one model 
  mojo._namespace(key);
  
  if (models.length) {
    
    $(models).each(function(index, model) {

      if (!model.mojoTemplate) {
        model.mojoTemplate = $(model).html().replace('%7B%7B', '{{').replace('%7D%7D', '}}');
      } 
      
      $(model).html("");
      
      var content = mojo.template(model.mojoTemplate, value);
      
      $(models).html(content);
      
      contentOfModel = $(models).html();
    });

    return contentOfModel;
    
  } else {
  	
  	window[key] = value;
  	return window[key];
  }
};

Model.get = function(key) {
  if (!key) { return false; }
  if ('string' != typeof key) { return false; }
  if ('undefined' == typeof mojo.ModelRegistry[key]) { return false; }
  if (arguments.lenght > 1) { return false; }
  return mojo.ModelRegistry[key];
};

Model.remove = function(key) {
  if (!key) { return false; }
  if ('string' != typeof(key)) { return false; }
  if ('undefined' == typeof mojo.ModelRegistry[key]) { return false; }
  delete mojo.ModelRegistry[key];
};
  
  window.mojo.Model = Model;
  window.mojo.ModelRegistry = {};
  if (window.MOJO) window.MOJO.Model = window.mojo.Model;
});