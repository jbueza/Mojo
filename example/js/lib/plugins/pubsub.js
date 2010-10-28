/// <reference path="jquery-1.3.2-vsdoc.js />
(function($) {
    var _evtGroup = {};

    $.fn.extend({
        ///	<summary>
        ///		Subscribes an object to particular eventName with a handler.
        ///     When the eventName is published, this handler will be executed.
        ///	</summary>
        ///	<param name="eventName" type="String">
        ///		It is the string name of the eventName.
        ///	</param>
        ///	<param name="eventHandler" type="Funtion">
        ///     Event handler
        ///	</param>
        ///	<param name="constArgs" type="Array">
        ///		The arguments of eventHandler function
        ///	</param>
        ///	<returns type="jQuery" />
        subscribe: function(eventName, eventHandler, constArgs) {
            var handlers = _evtGroup[eventName];

            if (!handlers) handlers = this._createEventName(eventName);

            var context = this;

            if (this.subscribers) {
                this.subscribers[eventName] = eventHandler;
                for (var item in handlers) {
                    if (item._fn === eventHandler) return this;
                }
            }

            var handler = function() { return eventHandler.apply(context, constArgs || arguments); }
            handler._fn = eventHandler;

            this._appendHandler(handlers, handler);
            return this;
        },
        ///	<summary>
        ///		Unsubscribes the particular eventName's handler.
        ///	</summary>
        ///	<param name="eventName" type="String">
        ///		It is the string name of the eventName.
        ///	</param>
        ///	<param name="eventHandler" type="Funtion">
        ///     Event handler
        ///	</param>
        ///	<returns type="jQuery" />
        unsubscribe: function(eventName, eventHandler) {
            var handlers = _evtGroup[eventName];
            if (!handlers) return false;

            return this._removeHandler(handlers, eventHandler);
        },
        ///	<summary>
        ///		Publishs the particular eventName.
        ///	</summary>
        ///	<param name="eventName" type="String">
        ///		It is the string name of the eventName.
        ///	</param>
        ///	<param name="args" type="Array">
        ///     The arguments of the eventHandler
        ///	</param>
        ///	<returns type="Boolen" />
        publish: function(eventName, args, context) {
            var handlers = _evtGroup[eventName];
            if (!handlers) return;

            var temp = handlers;
            var j = temp.length;
            _evtGroup[eventName] = [];

            for (var i = 0; i < j; i++) {
                var curr = temp.shift();
                _evtGroup[eventName].push(curr);
                if (curr.apply({}, args || []) === false) {
                    _evtGroup[eventName] = _evtGroup[eventName].concat(temp);
                    return false;
                }
            }
            return true;
        },
        ///	<summary>
        ///		Publishs the particular eventName on special object event.
        ///	</summary>
        ///	<param name="event" type="String">
        ///		It is the string name of the event.
        ///	</param>
        ///	<param name="eventName" type="String">
        ///		It is the string name of the eventName.
        ///	</param>
        ///	<param name="data" type="Array">
        ///     The arguments of the eventHandler
        ///	</param>
        ///	<returns type="jQuery" />
        publishOnEvent: function(event, eventName, data) {
            this._createEventName(eventName);

            this.bind(event, data, function(e) {
                $(this).publish(eventName, e.data, e);
            });

            return this;
        },
        _createEventName: function(eventName) {
            if (!_evtGroup[eventName]) {
                _evtGroup[eventName] = [];
            }
            return _evtGroup[eventName];
        },
        _appendHandler: function(handlers, eventHandler) {
            var j = handlers.length;
            for (var i = 0; i < j; i++) {
                if (handlers[i]._fn === eventHandler._fn) return false;
            }

            handlers.push(eventHandler);
            return true;
        },
        _removeHandler: function(handlers, eventHandler) {
            var j = handlers.length;
            if (!eventHandler) handlers = [];

            for (var i = 0; i < j; i++) {
                var curr = handlers.shift();
                if (curr._fn == eventHandler) return true;
                handlers.push(curr);
            }
            return false
        }
    });

    $.extend({
        subscribe: function(eventName, handler, data) {
            return $().subscribe(eventName, handler, data);
        },
        unsubscribe: function(eventName, handler) {
            return $().unsubscribe(eventName, handler);
        },
        publish: function(eventName, data, context) {
            return $().publish(eventName, data, context);
        }
    });
})(jQuery);