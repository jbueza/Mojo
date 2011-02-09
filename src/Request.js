/* 
 * Request 
 *
 * Class representation of a Controller Request instance. 
 * Encapsulates request-specific parameters, and context-specific 
 * information.
 *
 * @author Blast Radius (jbueza)
 */
function Request(paramsObj, callerObj, eventObj, controllerObj) {
  this.paramsObj = paramsObj;
  this.callerObj = callerObj;
  this.eventObj = eventObj;
  this.controllerObj = controllerObj;
};


Request.prototype.getController = function() {
  return this.controllerObj;
};

Request.prototype.getContextElement = function() {
  return this.getController().getContextElement();
};

Request.prototype.getCaller = function() {
  return this.callerObj;
};

Request.prototype.getEvent = function() {
  return this.eventObj;
};