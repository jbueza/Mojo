MOJO.define('MOJO.Messaging', function() {
"use strict";
var storage = $({});
var Messaging = function() {};

Messaging.subscribe = function() {
  storage.bind.apply( storage, arguments );
};

Messaging.unsubscribe = function() {
  storage.unbind.apply( storage, arguments );
};

Messaging.publish = function() {
  storage.trigger.apply( storage, arguments );
};


('undefined' == typeof window) ? process.MOJO.Messaging = Messaging : window.MOJO.Messaging = Messaging;
window.MOJO.Messaging = Messaging;
return Messaging;

  
  
  
});