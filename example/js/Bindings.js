//Bindings.js (New and improved SiteMap.js)

//use a very easy-to-use API
$("#navigation").mojo({
    //example of one binder mapping to a DOM element
    binders: [ 
        { binder: "NavigationBinder" }
    ]
});

$("#login-form").mojo({
    //an example of multiple binders into one context
    binders: [
        { binder: "LoginBinder", params: { } },
        { binder: "ValidationBinder", params: { } }
    ]
});