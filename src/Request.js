/* 
 * Request 
 *
 * Class representation of a Controller Request instance. 
 * Encapsulates request-specific parameters, and context-specific 
 * information.
 *
 * @author Blast Radius
 */
MOJO.define('Request', function() {
  
function Request(paramsObj, callerObj, eventObj, controllerObj) {
  if ('undefined' == typeof paramsObj || !paramsObj) throw new Error("'paramsObj' is required");
  if ('undefined' == typeof callerObj || !callerObj) throw new Error("'callerObj' is required");
  if ('undefined' == typeof eventObj || !eventObj) throw new Error("'eventObj' is required");
  if ('undefined' == typeof controllerObj || !controllerObj) throw new Error("'controllerObj' is required");
  
  this.paramsObj = paramsObj;
  this.callerObj = callerObj;
  this.eventObj = eventObj;
  this.controllerObj = controllerObj;
};

/* 
 * Return the request's controller
 */
Request.prototype.getController = function() {
  return this.controllerObj;
};

/* 
 * Returns the context DOM element
 */
Request.prototype.getContextElement = function() {
  return this.getController().getContextElement();
};

/* 
 * Returns the object that invoked the request
 */

Request.prototype.getCaller = function() {
  return this.callerObj;
};

/* 
 * Returns an event object that was generated from the user interaction
 */

Request.prototype.getEvent = function() {
  return this.eventObj;
};

window.Request = Request;
return Request;
});