mojo.define("mojo.Model", function() {

"use strict";

var $ = jQuery, Model = function() {};
    
Model.set = function(key, value) {
  //find in the DOM, if it's an element, pass it into the templating engine
  //if it's not an HTML element, then we can just store it in DOM
  var models = mojo.query('*[modelSource="' + key + '"]');
  if (models.length) {
      
      $(models).each(function(index, model) {
        
        model.mojoTemplate = $(model).html();
        $(model).html("");
        var content = mojo.template(model.mojoTemplate, value);
        $(models).html(content);
      });
  } else {
  	mojo._namespace(key);
  	window[key] = value;
  }
  
};

Model.get = function(key) {
  return mojo.ModelRegistry[key];
};

Model.remove = function(key) {
  delete mojo.ModelRegistry[key];
};
  
  window.mojo.Model = Model;
  if (window.MOJO) window.MOJO.Model = window.mojo.Model;
});