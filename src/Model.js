MOJO.define("MOJO.Model", function() {
"use strict";

var $ = jQuery
    , Model = function() {};
    
Model.set = function set(key, value) {
  //find in the DOM, if it's an element, pass it into the templating engine
  //if it's not an HTML element, then we can just store it in DOM
  
  
};

Model.get = function get(key) {
  return MOJO.ModelRegistry[key];
};

Model.remove = function remove(key) {
  delete MOJO.ModelRegistry[key];
};


  ('undefined' == typeof window) ? process.MOJO.Model = Model : window.MOJO.Model = Model;
  
  window.MOJO.__ModelRegistry = {};
  window.MOJO.Model = Model;
  return Model;
});