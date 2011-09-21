/* 
 * @author Jaime Bueza
 */
mojo.define('mojo.Messaging', function() {
"use strict";

var $ = jQuery
  , messageStore = $({})
  , Messaging = function() {};

Messaging.subscribe = function() {
  messageStore.bind.apply( messageStore, arguments );
};

Messaging.unsubscribe = function() {
  messageStore.unbind.apply( messageStore, arguments );
};

Messaging.publish = function() {
  messageStore.trigger.apply( messageStore, arguments );
};

window.mojo.Messaging = Messaging;  
if (window.MOJO) window.MOJO.Messaging = Messaging;
});