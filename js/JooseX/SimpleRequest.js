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
