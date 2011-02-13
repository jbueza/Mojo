function Model() {};

Model.getReference = function(key) {
};
Model.get = function(key) {};
Model.add = function(key) {};
Model.remove = function(key) {};


/* 
 *
 */
function ModelReference() {};

ModelReference.prototype.onUpdate = function(){};

//if you want to set a value    car.value('color', 'red');
//if you want to get a value    car.value('color');
ModelReference.prototype.value = function() {
  
  var self = this;
  
  if (arguments.length > 1) {
    self.arguments[0] = arguments[1];
    return true;
  } else {
    return self.arguments[0];
  }
};