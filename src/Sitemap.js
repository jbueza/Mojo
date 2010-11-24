Joose.Class('Mojolite.Sitemap', {
    has: {
        config: {
            access: "ro"
        }
    },
    methods: {
        getMatches: function() {
            var patternStack = [], contextStack = [], matches = [];
            patternStack.last = contextStack.last = function() {
                if (this.length > 0) {
                    return this[this.length - 1];
                }
            };
            var recursable = function(value, key) {
              if (value.pattern && (typeof key === "number") && value.attach) return true;
              throw ("Unrecognized Sitemap entry format somewhere inside " + (patternStack.join("/") || "Sitemap root"));
            };
            
            var recurse = function(value, key) {
                if (value.binder) {
                    matches.push({
                        name: value.binder,
                        contexts: contextStack.last() || [document],
                        options: value.options || {}
                    });

                } else if (typeof value.length === "number") {
                    Joose.A.each(value, recurse);

                } else if (recursable(value, key)) {
                    patternStack.push(value.pattern);
                    contextStack.push(
                        (typeof value.pattern == 'function')
                        ? value.pattern(contextStack.last())
                        : jQuery(value.pattern, contextStack.last()));

                    if (contextStack.last().length) Joose.A.each(value.attach, recurse);

                    contextStack.pop();
                    patternStack.pop();
                }
            };
            recurse(this.sitemap);
            return matches;
        },
        bindSitemap: function() {
            var thus = thus, matches = this.getMatches();
            var prerequisites = Joose.A.map(matches, function(x) { return x.name; });
            use(prerequisites, function() {
                Joose.A.each(matches, function(binderParams) { 
                    Joose.A.each(binderParams.contexts, function(context) {
                        var context = jQuery(context);
                        var binder = window;
                        Joose.A.each(binderParams.name.split('.'), function(token) {
                          binder = binder && binder[token];
                        });
                        if (!binder) {
                            throw "Unidentified binder name: " + binderParams.name;
                        }
                        if (!binder.registeredToContext(context))
                            new binder(context, binderParams.options);
                    });
                });
            });
        }
    }
});
