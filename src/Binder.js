/**
 * @class mojo.Binder
 */
Joose.Class('mojo.Binder', {
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
      return jQuery.extend({context: context}, options);
    },
    initialize: function(props) {
      var context = props.context
        , binders = this.my.getBinders(context);
      this.__context = context;
      if (this.my.registeredToContext(context)) {
          return; //Already bound this binder to this elements
      } else {
          this.my.getBinders(context)[this.meta.name] = this;
      }
    },
    getContextElement: function() {
      if (!this.__context) return null;
      return this.__context;
    },
    detach: function() {
      var binders = this.my.getBinders(this.getContextElement());
      delete binders[this.my.className];
      return (typeof binders[this.my.className] == 'undefined') ? true : false;
    },
    bindEventMap: function() {
      var eventMap = this.getEventMap();
      Joose.A.each(eventMap, jQuery.proxy(this, 'bindDomEvent'));
      return true;
    },
    bindDomEvent: function(args) {
      if (args.length == 0 || !args) {
        throw new Error("ERROR - bindDomEvent expects arguments");
      }
      var binder = this, root = args[0], selector = args[1], event = args[2], handler = args[3];
      root = jQuery((root === "context") ? this.getContext() : document);

      if (typeof event === "function") event = event.call(this);
      if (typeof selector === "function") selector = selector.call(this);

      var shouldDelegate = (typeof selector === "string") && selector.length;

      if (!selector) selector = root;
      var data = { context: this.getContext(), binder: this };
      
      if (shouldDelegate) {
        binder.delegated.push([root, selector, event, binder[handler]]);
        root.delegate(selector, event, data, binder[handler]);
      } else {
        if (typeof selector === "string") selector = jQuery(selector, root);
        binder.bound.push([selector, event, binder[handler]]);
        selector.bind(event, data, binder[handler]);
      }
      return true;
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
        var data = context.data('mojo');
        if (!data) { 
            context.data('mojo', data = {});
        }
        return (data.binders = data.binders || {});
      },
      registeredToContext: function(context) {
        return this.getBinders(context)[this.HOST.toString()];
      }
    }
  }
});
