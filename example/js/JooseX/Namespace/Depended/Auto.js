Class('JooseX.Namespace.Depended.Manager', {
    
    my : {
    
        have : {
            
            INC                             : Joose.is_NodeJS ? require.paths : [ 'lib', '/jsan' ],
            
            disableCaching                  : true,
            
            resources                       : {},
            
            resourceTypes                   : {},
            
            ANONYMOUS_RESOURCE_COUNTER      : 0
        },
    
        
        
        methods : {
            
            //get own resource of some thing (resource will be also attached to that abstract thing)
            //if the something is requesting own resource its considered loaded
            getMyResource : function (type, token, me) {
                var resource = this.getResource({
                    type : type,
                    token : token
                })
                
                if (resource.attachedTo && resource.attachedTo != me) throw resource + " is already attached to [" + resource.attachedTo + "]"
                
                resource.attachedTo     = me
                resource.loaded         = true
                resource.loading        = false
                
                return resource
            },
            
            
            getResource : function (descriptor) {
                
                if (typeof descriptor == 'object') {
                    var type                = descriptor.type = descriptor.type || 'javascript'
                    var token               = descriptor.token
                    var requiredVersion     = descriptor.version
                    
                    delete descriptor.version
                    
                } else 
                    if (typeof descriptor == 'string') {
                    
                        var match = /^(\w+):\/\/(.+)/.exec(descriptor)
                        
                        if (match) {
                            // type & token are explicitly specified
                            type    = match[1]
                            token   = match[2]
                            
                            if (type == 'http' || type == 'https') {
                                token   = type + '://' + token
                                type    = 'javascript'
                            }
                        } else {
                            // no type specified
                            token = descriptor
                            
                            type = /\//.test(token) || /\.js$/.test(token) ? 'javascript' : 'joose'
                        }
                    }
                    
                if (!token) {
                    token       = '__ANONYMOUS_RESOURCE__' + this.ANONYMOUS_RESOURCE_COUNTER++
                    descriptor  = undefined
                }
                
                var id = type + '://' + token
                
                var resource = this.resources[id]
                
                if (!resource) {
                    var resourceClass = this.resourceTypes[type]
                    if (!resourceClass) throw "Unknown resource type: [" + type + "]"
                    
                    resource = this.resources[id] = new resourceClass(typeof descriptor == 'object' ? descriptor : { 
                        token : token,
                        
                        type : type
                    })
                }
                
                resource.setRequiredVersion(requiredVersion)
                
                return resource
            },
            
            
            registerResourceClass : function (typeName, resourceClass) {
                this.resourceTypes[typeName] = resourceClass
            },
            
            
            use : function (dependenciesInfo, callback, scope) {
                var nsManager   = Joose.Namespace.Manager.my
                var global      = nsManager.global
                
                Class({
                    use    : dependenciesInfo,
                    
                    body   : function () {
                        if (callback) nsManager.executeIn(global, function (ns) {
                            callback.call(scope || this, ns)
                        })
                    }
                })
            }      
        }
    }
})

use = function (dependenciesInfo, callback, scope) {
    JooseX.Namespace.Depended.Manager.my.use(dependenciesInfo, callback, scope) 
}

use.paths = JooseX.Namespace.Depended.Manager.my.INC


Joose.I.FutureClass = function (className) { 
    return function () { 
        return eval(className) 
    } 
}


/**

Name
====


JooseX.Namespace.Depended.Manager - A global collection of all resources


SYNOPSIS
========

        JooseX.Namespace.Depended.Manager.my.registerResourceClass('custom-type', JooseX.Namespace.Depended.Resource.Custom)
        

DESCRIPTION
===========

`JooseX.Namespace.Depended.Manager` is a global collection of all resources. 

**Note:** Its a pure [static](http://openjsan.org/go?l=Joose.Manual.Static) class - all its methods and properties are static.


METHODS
=======

### registerResourceClass

> `void registerResourceClass(String type, Class constructor)`

> After you've created your custom resource class, you need to register it with call to this method.

> Then you can refer to new resources with the following descriptors: 

                {
                    type    : 'custom-type',
                    token   : 'some-token'
                }



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues>

For general Joose questions you can also visit #joose on irc.freenode.org or the forum at: [http://joose.it/forum](http://joose.it/forum)
 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](Resource.html)

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at [http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues](http://github.com/SamuraiJack/JooseX-Namespace-Depended-Manager/issues)



AUTHORS
=======

Nickolay Platonov [nplatonov@cpan.org](mailto:nplatonov@cpan.org)



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Class('JooseX.Namespace.Depended.Resource', {
    
    has : {
        
        attachedTo          : null,
        
        type                : null,
        token               : null,
        
        id                  : null,
        
        loading             : false,
        loaded              : false,
        ready               : false,
        
        presence            : null,
        readyness           : null,
        
        loadedFromURL       : null,
        
        readyListeners      : Joose.I.Array,
        
        dependencies        : Joose.I.Object,
        
        onBeforeReady       : { is : 'rw', init : null },
        readyDelegated      : false,
        
        version             : { is : 'rw', init : null },
        requiredVersion     : { is : 'rw', init : null },
        
        hasReadyCheckScheduled  : false
    },
    
    
    after: {
        
        initialize: function () {
            if (!this.id) this.id = this.type + '://' + this.token
        }
        
    },

    
    
    methods: {
        
        setOnBeforeReady : function (func) {
            if (this.onBeforeReady) throw "Can't redefine 'onBeforeReady' for " + this
            
            this.onBeforeReady = func
        },
        
        
        setVersion : function (version) {
            if (!version) return
            
            if (this.version && this.version != version) throw "Cant redefine version of " + this
            
            var requiredVersion = this.requiredVersion
            
            if (requiredVersion && version < requiredVersion) throw "Versions conflict on " + this + " required [" + requiredVersion + "], got [" + version + "]"
                
            this.version = version
        },
        
        
        setRequiredVersion : function (version) {
            if (!version) return
            
            var requiredVersion = this.requiredVersion
            
            if (!requiredVersion || version > requiredVersion) 
                if (this.isLoaded() || this.loading)
                    throw "Cant increase required version - " + this + " is already loaded"
                else
                    this.requiredVersion = version
        },
        
        
        toString : function () {
            return "Resource: id=[" + this.id + "], type=[" + this.meta.name + "]"
        },
        
        
        addDescriptor : function (descriptor) {
            var resource = JooseX.Namespace.Depended.Manager.my.getResource(descriptor)
            
            var dependencies    = this.dependencies
            var resourceID      = resource.id
            
            //if there is already such dependency or the resource is ready
            if (dependencies[ resourceID ] || resource.isReady()) return
            
            var me = this
            //pushing listener to the end(!) of the list
            resource.readyListeners.push(function () {
                
                delete dependencies[ resourceID ]
                me.checkReady()
            })
            
            //adding dependency
            dependencies[ resourceID ] = resource
            
            //we are not ready, since there are depedencies to load                
            this.ready = false
        },
        
        
        handleDependencies : function () {
            // || {} required for classes on which this Role was applied after they were created - they have this.dependencies not initialized
            Joose.O.eachOwn(this.dependencies || {}, function (resource) {
                resource.handleLoad()
            })
            
            this.checkReady()
        },
        
        
        checkReady : function () {
            if (!Joose.O.isEmpty(this.dependencies) || this.hasReadyCheckScheduled) return
            
            if (this.onBeforeReady) {
                
                if (!this.readyDelegated) {
                    this.readyDelegated = true
                    
                    var me = this
                    
                    this.onBeforeReady(function(){
                        me.fireReady()
                    }, me)
                }
            } else 
                this.fireReady()
        },
        
        
        fireReady: function () {
            this.ready = true
            
            var listeners = this.readyListeners
            
            this.readyListeners = []
            
            Joose.A.each(listeners, function (listener) {
                listener()
            })
        },
        
        
        isReady : function () {
            if (!this.isLoaded()) return false
            
            var isReady = false
            
            try {
                isReady = this.readyness()
            } catch (e) {
            }
            
            return isReady || this.ready
        },
        
        
        isLoaded : function () {
            var isPresent = false
            
            try {
                isPresent = this.presence()
            } catch (e) {
            }
            
            return isPresent || this.loaded
        },
        
        
        handleLoad: function() {
            
            if (this.isLoaded()) {
                this.checkReady()
                return
            }
            
            if (this.loading) return
            this.loading = true
            
            var urls = Joose.O.wantArray(this.getUrls())
            
            var me = this

            // this delays the 'checkReady' until the resourse will be *fully* materialized
            // *fully* means that even the main class of the resource is already "ready"
            // the possible other classes in the same file could be not
            // see 110_several_classes_in_file.t.js, 120_script_tag_transport.t.js for example
            me.hasReadyCheckScheduled = true
            
            var onsuccess = function (resourceBlob, url) {
                me.loaded = true
                me.loading = false
                
                me.loadedFromURL = url
                
                me.materialize(resourceBlob, url)
                
                me.hasReadyCheckScheduled = false
                
                
                me.checkReady()
            }
            
            var onerror = function (e) {
                //if no more urls
                if (!urls.length) throw me + " not found" 
                
                me.load(urls.shift(), onsuccess, onerror)
            }
            
            this.load(urls.shift(), onsuccess, onerror)
        },
        

        getUrls: function () {
            throw "Abstract resource method 'getUrls' was called"
        },
        
        
        load : function (url, onsuccess, onerror) {
            throw "Abstract resource method 'load' was called"
        },
        
        
        materialize : function (resourceBlob) {
            throw "Abstract resource method 'materialize' was called"
        }
        
    }
})


/**

Name
====


JooseX.Namespace.Depended.Resource - Abstract resource class 


SYNOPSIS
========
        
        //mostly for subclassing only
        Class("JooseX.Namespace.Depended.Resource.JavaScript", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Resource` is an abstract resource class. Its not supposed to be used directly, instead you should use
one of its subclasses.


ATTRIBUTES
==========

### attachedTo

> `Object attachedTo`

> An arbitrary object to which this resource is attached (its a corresponding class in JooseX.Namespace.Depended)


### type

> `String type`

> A type of resource  - plain string. `JooseX.Namespace.Depended.Manager` maintain a collection of resource types, accessible 


### token

> `String token`

> A token of resource  - plain string with arbitrary semantic. Each subclass should provide this semantic along with `token -> url` conertion method (locator)  


### id

> `String id`

> An id of resource - is computed as `type + '://' + token'


### loading

> `Boolean loading`

> A sign whether this resource is currently loading

  
### loaded

> `Boolean loaded`

> A sign whether this resource is already loaded


### ready

> `Boolean ready`

> A sign whether this resource is considered ready. Resource is ready, when its loaded, and all its dependencies are ready.


### loadedFromURL

> `String loadedFromURL`

> An url, from which the resource was loaded.


### readyListeners

> `Array[Function] readyListeners`

> An array of functions, which will be called after this resource becomes ready. Functions will be called sequentially. 


### dependencies

> `Object dependencies`

> An object containing the dependencies of this resource. Keys are the `id`s of resources and the values - the resource instances itself.

 
### onBeforeReady

> `Function onBeforeReady`

> A function, which will be called, right after the all dependencies of the resource became ready, but before its own `readyListeners` will be called.
It supposed to perform any needed additional actions to post-process the loaded resource.

> Function will receive two arguments - the 1st is the callback, which should be called when `onBeforeReady` will finish its work. 2nd is the resource instance.

  
### version

> `r/w Number version`

> A version of this resource. Currently is handled as Number, this may change in future releases.

  
### requiredVersion

> `r/w Number requiredVersion`

> A *requiredVersion* version of this resource. Required here means the maximum version from all references to this resource. 



METHODS
=======

### addDescriptor

> `void addDescriptor(Object|String descriptor)`

> Add the resource, described with passed descriptor as the dependency for this resource.


### getUrls

> `String|Array[String] getUrls()`

> Abstract method, will throw an exception if not overriden. It should return the array of urls (or a single url) from which this resource can be potentially loaded. 
This method should take into account the `JooseX.Namespace.Depended.Manager.my.INC` setting


### load

> `void load(String url, Function onsuccess, Function onerror)`

> Abstract method, will throw an exception if not overriden. It should load the content of the resource from the passed `url`. If there was an error during loading
(for example file not found) should not throw the exception. Instead, should call the `onerror` continuation with it (exception instance).

> After successfull loading, should call the `onsuccess` continuation with the resource content as 1st argument, and `url` as 2nd: `onsuccess(text, url)`


### materialize

> `void materialize(String resourceBlob, String url)`

> Abstract method, will throw an exception if not overriden. It should "materialize" the resource. The concrete semantic of this action is determined by resource nature.
For example this method can create some tag in the DOM tree, or execute the code or something else.

> Currently this method is supposed to operate synchronously, this may change in future releases. 
 

SEE ALSO
========

Web page of this package: <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Resource/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-Namespace-Depended-Resource/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Role('JooseX.Namespace.Depended.Materialize.Eval', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob) {
            ;(function (){
                eval(resourceBlob)
            })()
        }
    }
})

/**

Name
====


JooseX.Namespace.Depended.Materialize.Eval - materializator, which treat the resource content as JavaScript code, and use `eval` function to evalute it 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Materialize.Eval, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Materialize.Eval` is a materializator role. It provide the implementation of `materialize` method. 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Class('JooseX.Namespace.Depended.Resource.JavaScript', {
    
    isa : JooseX.Namespace.Depended.Resource,
    
    has : {
        
        hasDirectUrl    : false
    },
    
    after: {
        
        initialize: function () {
            var me      = this
            
            if (this.type == 'nonjoose') this.type = 'javascript'
            
            
            var presence = this.presence
            
            if (typeof presence == 'string') this.presence = function () {
                return eval(presence)
            }
            
            if (!presence) this.presence = function () {
                return eval(me.token)
            }
            
            if (!this.readyness) this.readyness = this.presence
        }
        
    },

    
    methods : {
        
        BUILD : function (config) {
            var token = config.token
            
            var match = /^=(.*)/.exec(token)
            
            if (match) {
                this.hasDirectUrl   = true
                
                token               = match[1]
            }
            
            if (/^http/.test(token)) {
                this.hasDirectUrl   = true
                
                config.trait        = JooseX.Namespace.Depended.Transport.ScriptTag
            }
            
            if (/^\//.test(token)) this.hasDirectUrl   = true
                
            return config
        },
        
        
        getUrls : function () {
            var url = this.token
            
            if (this.hasDirectUrl) return [ url ]
            
            var manager = JooseX.Namespace.Depended.Manager.my
            
            return Joose.A.map(manager.INC, function (libroot) {
                libroot = libroot.replace(/\/$/, '')
                
                return [ libroot ].concat(url).join('/') + (manager.disableCaching ? '?disableCaching=' + new Date().getTime() : '')
            })
        }
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('javascript',    JooseX.Namespace.Depended.Resource.JavaScript)
JooseX.Namespace.Depended.Manager.my.registerResourceClass('nonjoose',      JooseX.Namespace.Depended.Resource.JavaScript)
;
Class('JooseX.Namespace.Depended.Resource.JooseClass', {
    
    isa : JooseX.Namespace.Depended.Resource.JavaScript,
    
    // NOTE : we don't add the default materialization and transport roles here - they'll be added
    // in one of the Bootstrap/*.js files
    
    after: {
        
        initialize: function () {
            var me = this
            
            this.presence = function () {
                var c = eval(me.token)
                
                return c && c.meta.resource
            }
            
            this.readyness = function () {
                var c = eval(me.token)
                
                return c && c.meta.resource.ready
            }
        }
        
    },
    
    
    methods : {
        
        addDescriptor : function (descriptor) {
            if (typeof descriptor == 'object' && !descriptor.token) 
                Joose.O.eachOwn(descriptor, function (version, name) {
                    this.addDescriptor({
                        type : 'joose',
                        token : name,
                        version : version
                    })
                }, this)
            else
                this.SUPER(descriptor)
        },
        
        
        getUrls : function () {
            var urls = []
            var className = this.token.split('.')
            
            var manager = JooseX.Namespace.Depended.Manager.my
            
            return Joose.A.map(manager.INC, function (libroot) {
                libroot = libroot.replace(/\/$/, '')
                
                return [ libroot ].concat(className).join('/') + '.js' + (manager.disableCaching ? '?disableCaching=' + new Date().getTime() : '')
            })
        }
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('joose', JooseX.Namespace.Depended.Resource.JooseClass);
Class("JooseX.SimpleRequest", {

    have : {
    	req : null
	},

    
    methods: {
    	
        initialize: function () {
            if (window.XMLHttpRequest)
                this.req = new XMLHttpRequest()
            else
                this.req = new ActiveXObject("Microsoft.XMLHTTP")
        },
        
        
        getText: function (urlOrOptions, async, callback, scope) {
            var req = this.req
            
            var headers
            var url
            
            if (typeof urlOrOptions != 'string') {
                headers = urlOrOptions.headers
                url = urlOrOptions.url
                async = async || urlOrOptions.async
                callback = callback || urlOrOptions.callback
                scope = scope || urlOrOptions.scope
            } else url = urlOrOptions
            
            req.open('GET', url, async || false)
            
            if (headers) Joose.O.eachOwn(headers, function (value, name) {
                req.setRequestHeader(name, value)
            })
            
            try {
                req.onreadystatechange = function (event) {  
                    if (async && req.readyState == 4) {  
                        if (req.status == 200 || req.status == 0) callback.call(scope || this, true, req.responseText)
                        else callback.call(scope || this, false, "File not found: " + url)
                    }  
                };  
                req.send(null)
            } catch (e) {
                throw "File not found: " + url
            }
            
            if (!async)
                if (req.status == 200 || req.status == 0) return req.responseText; else throw "File not found: " + url
            
            return null
        }
    }
})

/**

Name
====


JooseX.SimpleRequest - Simple XHR request abstraction


SYNOPSIS
========

        var req = new JooseX.SimpleRequest()
        
        //asynchronous
        req.getText('http://google.com', true, function (success, text) {
            
            if (success) {
                ...
            }
            
        }, this)
        
        
        //synchronous
        try {
            var text = req.getText('http://google.com')
        } catch (e) {
        }
        
        
        //more options
        req.getText({
            
            url : 'http://google.com',
            async : true, 
            
            callback : function (success, text) {
                if (success) {
                    ...
                }
            }, 
            scope : this,
            
            headers : {
                'X-Custom-Header1' : 'Value',
                'X-Custom-Header2' : 'Value'
            }
        })


DESCRIPTION
===========

`JooseX.SimpleRequest` is a *simple* XHR request abstraction (yet it works reasonably well across all major browsers).
It implements only 'GET' requests. If you need more features, you may want to look for another package.


METHODS
=======

### getText

> `void getText(String url, true, Function callback, [Object scope])`

> The signature above corresponds to asynchrnous usage. Method do not return the value and do not throws exception on error. 
Instead, the success/error flag and returned text will be passed to `callback` functions, which will be executed in optional `scope`

> `String getText(String url)`

> The signature above corresponds to synchronous usage. Method returns the fetched text and throws exception on error. 

> `void|String getText(Object params)`

> The signature above combine both variants of usage. The parameters for the call are passed as object with the following keys:
 
> - `url` - url to fetch text from
 
> - `async` - `true` for asynchrnous mode, `false` for synchronous
 
> - `callback` - the callback function. Will be called in asynchronous usage mode as callback(success, text)
 
> - `scope` - optional scope for `callback`
 
> - `headers` - object which key/value pairs will be used to initialize the headers of the request 



SEE ALSO
========

Web page of this package: <http://github.com/SamuraiJack/JooseX-SimpleRequest/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-SimpleRequest/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

        
[Test.Run.Result]: Result.html
[Test.Run.Harness]: Harness.html

GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-SimpleRequest/issues>

For general Joose questions you can also visit #joose on irc.freenode.org or the forum at: [http://joose.it/forum](http://joose.it/forum)
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/JooseX-SimpleRequest/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at [http://github.com/SamuraiJack/JooseX-SimpleRequest/issues](http://github.com/SamuraiJack/JooseX-SimpleRequest/issues)



AUTHORS
=======

Malte Ubl

Nickolay Platonov [nplatonov@cpan.org](mailto:nplatonov@cpan.org)



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Role('JooseX.Meta.Lazy', {
    
    have : {
        pendedProps                 : null,
        originalConstructor         : null,
        
        isEager                     : false
    },
    
    
    
    before : {
        
        prepareProps : function (extend) {
            if (extend.eager) this.isEager = true
            delete extend.eager
        },

        
        extend : function (props) {
            if (this.pending) this.finalize()
        }
        
    },
    
    
    after : {
        
        adaptConstructor: function (c) {
            c.getMeta = function () {
                var meta = this.meta
                if (meta.pending) meta.finalize()
                
                return meta
            }        
        }
        
    },
    
    
    override : {
        
        extractConstructor : function (extend) {
            var originalConstructor = this.SUPER(extend)
            
            this.adaptConstructor(originalConstructor)
            
            return function () {
                var thisMeta = arguments.callee.meta    
                
                if (thisMeta.pending) thisMeta.finalize()    
                
                return originalConstructor.apply(this, arguments)    
            }
        },
        
        //is not re-entrant
        finalize : function (props) {
            if (this.isEager) return this.SUPER(props)
            
            if (!this.pending) {
                
                this.pending = true
                this.pendedProps = props
                
                return
            }
            
            this.pending = false
            this.isEager = true
            
            this.SUPER(this.pendedProps)
            delete this.pendedProps
        }
        
    },
    
    
    body : function () {
        
        //lazy checker will be installed system wide (into Joose.Managed.Bootstrap) to monitor for each usual class
        //whether the superclass or a role being added is lazy 
        var LazyChecker = Role({
            meta : Joose.Managed.Role,
            
            have : {
                pending                     : false
            },
            
            before : {
                
                addRole : function () {
                    Joose.A.each(arguments, function(arg) {
                        var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role    
                        
                        var roleMeta = role.meta
                        
                        if (roleMeta.meta.hasAttribute('pending') && roleMeta.pending) roleMeta.finalize()    
                    })
                },
                
                finalize : function (extend) {
                    if (!(this instanceof Joose.Managed.Role) && this.superClass != this.defaultSuperClass) {
                        
                        var superMeta = this.superClass.meta
                        
                        if (superMeta && superMeta.meta.hasAttribute('pending') && superMeta.pending) superMeta.finalize()
                    }
                }
            }
        })
        
        Joose.Managed.Bootstrap.meta.extend({
            does : LazyChecker
        })
        
        Joose.Namespace.Manager.my.register('LazyClass', Class('Class', {
            isa     : Joose.Meta.Class,
            meta    : Joose.Meta.Class,
            
            does    : JooseX.Meta.Lazy
        }))
        
        Joose.Namespace.Manager.my.register('LazyRole', Class('Role', {
            isa     : Joose.Meta.Role,
            meta    : Joose.Meta.Class,
            
            does    : JooseX.Meta.Lazy
        }))
    }
    
})    



/**

Name
====


JooseX.Meta.Lazy - A trait to make your metaclasses lazy


SYNOPSIS
========

        Role("Some.Lazy.Role", {
            
            trait : JooseX.Meta.Lazy,
            
            
            has : {
                ...
            },
            
            
            methods : {
                ...
            }
        })

        Class("Some.Lazy.Class", {
            
            trait : JooseX.Meta.Lazy,
            
            does : Some.Lazy.Role
            
            
            has : {
                ...
            },
            
            
            methods : {
                ...
            }
        })
        
        // your class and role will be actually created only in this call
        var instance = new Some.Lazy.Class({
        })
        
        
        // alternative declaration - no traits required

        LazyRole("Some.Lazy.Role", {
            ...
        })

        LazyClass("Some.Lazy.Class", {
            ...
        })


DESCRIPTION
===========

`JooseX.Meta.Lazy` is a meta-role, making your class (or role) lazy. "Lazy" here means, that the creation of the
metaclass instance will be deferred until the first instantiation of class (or first consumption of role).

If you have a *big* class hierarchy (like the [bridged ExtJS hierarchy](http://openjsan.org/go?l=JooseX.Bridge.Ext) for example or your own framework), 
this module can reduce the initialization time.

You can apply it as a trait (the 1st example in the synopsys), or you can use the new declaration helpers: `LazyClass` or `LazyRole`


INHERITANCE
===========

Note, that by default, subclasses uses the same metaclass as their parents. Thus, if you'll subclass the lazy class, the resulting class will be 
also lazy. If you'd like to avoid this, see the next section for details.  


`eager` BUILDER
===============

If you are using the lazy metaclass and still wants to create a normal class, you can use new builder `eager` for that:

        Class("Some.Lazy.Class", {
            trait : JooseX.Meta.Lazy,
            
            ...
        })
        
        
        Class("Some.Eager.Class", {
            isa : Some.Lazy.Class // will provide the lazy meta for this class
            
            eager : true // will create class immediately
        })



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-Meta-Lazy/issues>

For general Joose questions you can also visit #joose on irc.freenode.org or the forum at: <http://joose.it/forum>
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/JooseX-Meta-Lazy/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-Meta-Lazy/issues>



ACKNOWLEDGMENTS
===============

Many thanks to Malte Ubl for the idea of this module.


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/
;
Role('JooseX.Namespace.Depended.Materialize.ScriptTag', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob) {
            var loaderNode = document.createElement("script")
            
            loaderNode.text = resourceBlob
            
            //adding to body, because Safari do not create HEAD for iframe's documents
            document.body.appendChild(loaderNode)
        }
    }
})
;
Role('JooseX.Namespace.Depended.Transport.XHRAsync', {
    
    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var req = new JooseX.SimpleRequest()
            
            try {
                req.getText(url, true, function (success, text) {
                    
                    if (!success) { 
                        onerror(this + " not found") 
                        return 
                    }
                    
                    onsuccess(text, url)
                })
            } catch (e) {
                onerror(e)
            }
        }
    }
})


/**

Name
====


JooseX.Namespace.Depended.Transport.XHRAsync - transport, which use the asynchronous XHR request for resource loading 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.XHRAsync, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.XHRAsync` is a transport role. It provide the implementation of `load` method, which use the 
asynchronous XHR request for resource loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Transport.XHRSync', {
    
    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var req = new JooseX.SimpleRequest()
            var text; 
            
            try {
                text = req.getText(url)
            } catch (e) {
                onerror(e)
                return
            }
            
            onsuccess(text, url)
        }
    }
})


/**

Name
====


JooseX.Namespace.Depended.Transport.XHRSync - transport, which use the synchronous XHR request for resource loading 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.XHRSync, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.XHRSync` is a transport role. It provide the implementation of `load` method, which use the 
synchronous XHR request for resource loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Transport.ScriptTag', {

    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var loaderNode = document.createElement("script")
            
//            if (Joose.is_IE) var errorTimeOut
            
            loaderNode.onload = loaderNode.onreadystatechange = function () {
                if (!loaderNode.readyState || loaderNode.readyState == "loaded" || loaderNode.readyState == "complete" || loaderNode.readyState == 4 && loaderNode.status == 200)
                    //surely for IE6..
                    setTimeout(function () { onsuccess(loaderNode.text, url) }, 1)
            }
            
            loaderNode.setAttribute("type", "text/javascript")
            loaderNode.setAttribute("src", url)
            document.getElementsByTagName("head")[0].appendChild(loaderNode)
        },

        
        materialize : function () {
        }
        
    }
    
})

/**

Name
====


JooseX.Namespace.Depended.Transport.ScriptTag - transport, which use the &lt;script&gt; tag for resource loading 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.ScriptTag, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.ScriptTag` is a transport role. It provide the implementation of `load` method, which use the 
&lt;script&gt; tag for resource loading. It also overrides the `materialize` method as &lt;script&gt; tag execute the code along with loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Transport.NodeJS', {

    requires : [ 'handleLoad' ],
    
    override : {
        
        load: function (url, onsuccess, onerror) {
            var fs = require('fs')
            
            fs.readFile(url, function (err, data) {
                if (err) {
                    onerror(err)
                    
                    return
                }
                
                onsuccess(data, url)
            })            
        }
    }
})


/**

Name
====


JooseX.Namespace.Depended.Transport.Node - transport, which use the `fs.readFile()` call of NodeJS, to load the content of resource. 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Transport.Node, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Transport.Node` is a transport role. It provide the implementation of `load` method, 
which use the `fs.readFile()` call of NodeJS for resource loading. 



SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Role('JooseX.Namespace.Depended.Materialize.NodeJS', {
    
    requires : [ 'handleLoad' ],
    
    methods : {
        
        materialize : function (resourceBlob, url) {
            
            // global scope
            if (process.global == global)
            
                process.compile(
                    '(function (exports, require, module, __filename, __dirname) {' + resourceBlob + '})', 
                    url
                )(exports, require, module, __filename, __dirname)
                
            else
                // running in Test.Run
                (function (){
                    eval(resourceBlob + '')
                })()
        }
    }
})

/**

Name
====


JooseX.Namespace.Depended.Materialize.NodeJS - materializator, which execute the code, using the `Script.runInThisContext` call of NodeJS. 


SYNOPSIS
========
        
        //generally for consuming only
        
        Class("JooseX.Namespace.Depended.Resource.Custom", {
        
            isa : JooseX.Namespace.Depended.Resource,
            
            does : [ JooseX.Namespace.Depended.Materialize.NodeJS, ...]
            
            ...
        })


DESCRIPTION
===========

`JooseX.Namespace.Depended.Materialize.NodeJS` is a materializator role. It provide the implementation of `materialize` method. 


SEE ALSO
========

Authoring [JooseX.Namespace.Depended](../Authoring.html)

Abstract base resource class: [JooseX.Namespace.Depended.Resource](../Resource.html)


General documentation for Joose: <http://openjsan.org/go/?l=Joose>


AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009-2010, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


*/;
Class('JooseX.Namespace.Depended.Resource.Require', {
    
    isa     : JooseX.Namespace.Depended.Resource,
    
    
    methods : {
        
        getUrls : function () {
            return [ this.token ]
        },
        
        
        load: function (url, onsuccess, onerror) {
            
            require.async(url, function (err) {
                if (err instanceof Error) 
                    onerror(err)
                else
                    onsuccess('', url)
            })
            
        },

        
        materialize : function () {
        }
        
    }

})

JooseX.Namespace.Depended.Manager.my.registerResourceClass('require', JooseX.Namespace.Depended.Resource.Require)
;
Role('JooseX.Namespace.Depended', {
    
    /*VERSION*/VERSION : 0.08,
    
    meta : Joose.Managed.Role,
    
    requires : [ 'prepareProperties' ],
    
    
    have : {
        containResources                    : [ 'use', 'meta', 'isa', 'does', 'trait', 'traits' ]
    },

    
    override: {
        
        prepareProperties : function (name, extend, defaultMeta, callback) {
            
            if (name && typeof name != 'string') {
                extend = name
                name = null
            }
            
            extend = extend || {}
            
            var summaredDeps = []
            
            var extendMy = extend.my
            
            //gathering all the related resourses from various builders
            //also gathering resourses of 'my'
            Joose.A.each(this.containResources, function (propName) {
                
                this.collectDependencies(extend[propName], summaredDeps, extend, propName)
                    
                if (extendMy && extendMy[propName]) this.collectDependencies(extendMy[propName], summaredDeps, extendMy, propName)
            }, this)
            

            //and from externally collected additional resources 
            this.alsoDependsFrom(extend, summaredDeps)
            
            
            var resource = JooseX.Namespace.Depended.Manager.my.getResource({
                type : 'joose',
                token : name
            })
            
            
            if (extend.VERSION) resource.setVersion(extend.VERSION)
            
            //BEGIN executes right after the all dependencies are loaded, but before this module becomes ready (before body())
            //this allows to manually control the "ready-ness" of module (custom pre-processing)
            //BEGIN receives the function (callback), which should be called at the end of custom processing 
            if (extend.BEGIN) {
                resource.setOnBeforeReady(extend.BEGIN)
                
                delete extend.BEGIN
            }
            
            Joose.A.each(summaredDeps, function (descriptor) {
                resource.addDescriptor(descriptor)
            })
            
            
            //skip constructing for classes w/o dependencies 
            if (Joose.O.isEmpty(resource.dependencies)) {
                this.inlineDependencies(extend)
                
                var res = this.SUPER(name, extend, defaultMeta, callback)
                
                //this will allow to classes which don't have dependencies to be ready synchronously
                resource.checkReady()
                
                return res
            } else {
                // defer the dependencies loading, because they actually could be provided later in the same bundle file
                // this, however, affect performance, so bundles should be created in the dependencies-ordered way
                setTimeout(function () {
                    resource.handleDependencies()
                }, 0)
                
                // debugging warning
                if (typeof ENABLE_DEFERRED_DEPS_WARNING != 'undefined')
                    console.log('Deferred deps handling for class [' + name + '], deps = [' + JSON.stringify(resource.dependencies) + ']')
            }
            

            
            var me = this
        
            //unshift is critical for correct order of readyListerens processing!
            //constructing is delaying until resource will become ready 
            resource.readyListeners.unshift(function () {
                me.inlineDependencies(extend)
                
                me.prepareProperties(name, extend, defaultMeta, callback)
            })
            
            return this.create(name, Joose.Namespace.Keeper, {})
        },
        
        
        create : function () {
            var meta = this.SUPERARG(arguments).meta
            
            meta.resource = meta.resource || JooseX.Namespace.Depended.Manager.my.getMyResource('joose', meta.name, meta.c)
            
            return meta.c
        }
    },
    //eof override
    
    
    methods : {
        
        alsoDependsFrom : function (extend, summaredDeps) {
        },
        
        
        collectDependencies : function (from, to, extend, propName) {
            Joose.A.each(Joose.O.wantArray(from), function (descriptor) {
                if (descriptor && typeof descriptor != 'function') to.push(descriptor)
            })
        },
        
        
        inlineDependencies : function (extend) {
            this.inlineDeps(extend)
            
            var extendMy = extend.my
            
            if (extendMy) this.inlineDeps(extendMy)
        },
        
        
        inlineDeps : function (extend) {
            delete extend.use
            
            Joose.A.each(this.containResources, function (propName) {
                
                if (extend[propName]) {
                
                    var descriptors = []
                    
                    Joose.A.each(Joose.O.wantArray(extend[propName]), function (descriptor, index) {
                        
                        var descType = typeof descriptor
                        
                        if (descType == 'function')
                            descriptors.push(descriptor.meta ? descriptor : descriptor())
                        else
                            if (descType == 'object')
                                if (descriptor.token)
                                    descriptors.push(eval(descriptor.token)) 
                                else
                                    Joose.O.each(descriptor, function (version, name) { 
                                        descriptors.push(eval(name)) 
                                    })
                            else 
                                if (descType == 'string')
                                    descriptors.push(eval(descriptor))
                                else 
                                    throw "Wrong dependency descriptor format: " + descriptor
                        
                    })
                    
                    if (propName != 'isa' && propName != 'meta')
                        extend[propName] = descriptors
                    else
                        if (descriptors.length > 1) 
                            throw "Cant specify several super- or meta- classes"
                        else
                            extend[propName] = descriptors[0]
                        
                }
            })
        }
    }
})


Joose.Namespace.Manager.meta.extend({
    does : JooseX.Namespace.Depended
})


Joose.Namespace.Keeper.meta.extend({
    
    after: {
        
        copyNamespaceState: function (targetClass) {
            targetClass.meta.resource = this.resource
        }
    }
})
;
if (Joose.is_NodeJS) {

    JooseX.Namespace.Depended.Resource.JavaScript.meta.extend({
        
        does : [ JooseX.Namespace.Depended.Transport.NodeJS, JooseX.Namespace.Depended.Materialize.NodeJS ]
    })
    
    
    JooseX.Namespace.Depended.Manager.my.disableCaching = false
    
    Joose.Namespace.Manager.my.containResources.unshift('require')
    
    
    
    JooseX.Namespace.Depended.meta.extend({
        
        override : {
            
            collectDependencies : function (from, to, extend, propName) {
                if (propName != 'require') return this.SUPERARG(arguments)
                
                if (!from) return
                
                Joose.A.each(Joose.O.wantArray(from), function (url) {
                    to.push({
                        type    : 'require',
                        token   : url
                    })
                })
                
                delete extend.require
            }
        }
    })
} else
    JooseX.Namespace.Depended.Resource.JavaScript.meta.extend({
        
        does : [ JooseX.Namespace.Depended.Transport.XHRAsync, JooseX.Namespace.Depended.Materialize.Eval ]
    })
;
