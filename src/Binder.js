Joose.Class('Mojolite.Binder', {
    has: {
        __context: { is: "ro", required: true },
        __eventMap: { is: "ro", init: []},
        delegated: {init: []},
        bound: {init: []}
    },
    methods : {
        BUILD: function(context, options) {
            if (options.context) {
                throw "Attempt to set reserved context parameter in " + this.my.className;
            }
            return $.extend({context: context}, options);
        },
        initialize: function(props) {
            var context = props.context;
            var binders = this.my.getBinders(context); 
            if (this.my.registeredToContext(context)) {
                return; //Already bound this binder to this elements
            } else {
                this.my.getBinders(context)[this.meta.name] = this;
            }
        },
        detach: function() {
            var binders = this.my.getBinders(this.context);
            delete binders[this.my.className];
        },
        bindEventMap: function() {
            var eventMap = this.getEventMap();
            Joose.A.each(eventMap, jQuery.proxy(this, 'bindDomEvent'));
        },
        bindDomEvent: function(args) {
            var binder = this, root = args[0], selector = args[1], event = args[2], handler = args[3];
            root = jQuery((root === "context") ? this.getContext() : document);

            if (typeof event === "function") event = event.call(this);
            if (typeof selector === "function") selector = selector.call(this);

            var shouldDelegate = (typeof selector === "string") && selector.length;

            if (!selector) selector = root;
            var data = {context: this.getContext(), binder: this}
            
            if (shouldDelegate) {
                binder.delegated.push([root, selector, event, binder[handler]]);
                root.delegate(selector, event, data, binder[handler]);
            } else {
                if (typeof selector === "string") selector = jQuery(selector, root);
                binder.bound.push([selector, event, binder[handler]]);
                selector.bind(event, data, binder[handler]);
            }
        },
        unbindEventMap: function() {
            Joose.A.each(this.delegated, function(d) {
                d[0].undelegate(d[1], d[2], d[3]);
            });
            this.delegated = [];
            
            Joose.A.each(this.bound, function(d) {
                d[0].unbind(d[1], d[2], d[3]);
            });
            this.bound = [];
        }
    },
    after: {
        initialize: function() {
           this.bindEventMap();
        }
    },
    before: {
        detach: function() {
            this.unbindEventMap();
        }
    },
    my: {
        has : {
            HOST: null
        },
        methods: {
            getBinders: function(context) {
                var data = context.data('mojolite');
                if (!data) { 
                    context.data('mojolite', data = {})
                }
                return (data.binders = data.binders || {});
            },
            registeredToContext: function(context) {
                return this.getBinders(context)[this.HOST.toString()];
            }
        }
    }
});
