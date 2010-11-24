function extend(c,p) {
  c.prototype = Object.create(p.prototype, {
    "constructor": {
      value: c
    }, 
    "super": { 
      value: p
    }
  });
  
  return c;
};

Controller = function(options) {
  this.initialize();
};

Controller.prototype.initialize = function() {
  console.log("initializing");
};



var Controller = new Controller({});

var cat = extend({
  meow: function() {
    console.log("Meow!!");
  }
}, Controller);

console.log(cat);