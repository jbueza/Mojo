mojo.define("mojo.Model", function() {

"use strict";

var $ = jQuery, Model = function() {};
    
Model.set = function set(key, value) {
  //find in the DOM, if it's an element, pass it into the templating engine
  //if it's not an HTML element, then we can just store it in DOM
  var models = MOJO.query('*[modelSource="' + + '"]');
  if (models.length) {
  	models.each(function(index, model) {
  		console.log(model);
  	});
  } else {
  	MOJO._namespace(key);
  	window[key] = value;
  }
  
};

Model.get = function get(key) {
  return MOJO.ModelRegistry[key];
};

Model.remove = function remove(key) {
  delete MOJO.ModelRegistry[key];
};
  
  window.mojo.Model = Model;
  if (window.MOJO) window.MOJO.Model = window.mojo.Model;
});