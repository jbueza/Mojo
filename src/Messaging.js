/* 
 * @author Jaime Bueza
 */
mojo.define('mojo.Messaging', function() {
"use strict";

var $ = jQuery
  , messageStore = $({})
  , Messaging = function() {};

  /*
   * Subscribes to a particular messaging topic
   *
   * @param topic {String} - Represents a topic for messages to get pushed to
   * @param callback {Function} - A callback to execute when the topic receives a message
   */
  Messaging.subscribe = function() {
    messageStore.bind.apply( messageStore, arguments );
  };
  
  /* 
   * Unsubscribes to a particular topic
   * 
   * @param topic {String} - A Messaging topic to unsubscribe from
   */
  Messaging.unsubscribe = function() {
    messageStore.unbind.apply( messageStore, arguments );
  };

 /* 
  * Publishes a message to a particular topic
  * @param topic {String} - A Messaging Topic to push a message to
  * @param params {Object} - A JSON object that gets passed into the subscription topic
  * Example: mojo.Messaging.publish("MyAwesomeTopic", parameters)
  */
  Messaging.publish = function() {
    messageStore.trigger.apply( messageStore, arguments );
  };

  mojo.Messaging = Messaging;

});