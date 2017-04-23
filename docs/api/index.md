## Modules

<dl>
<dt><a href="#module_nails">nails</a></dt>
<dd><p>Nails, a Rails clone in Node</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Handler">Handler</a></dt>
<dd><p>Routing handler</p>
</dd>
<dt><a href="#Route">Route</a></dt>
<dd><p>Object representing a route at runtime</p>
</dd>
<dt><a href="#Server">Server</a></dt>
<dd><p>HTTP Server handler</p>
</dd>
<dt><a href="#Auth">Auth</a></dt>
<dd><p>HTTP auth checker and deserializer</p>
</dd>
<dt><a href="#Expires">Expires</a></dt>
<dd><p>Class handling expiry of the response</p>
</dd>
<dt><a href="#Cache">Cache</a></dt>
<dd><p>Class handling caching</p>
</dd>
<dt><a href="#DoubleRenderError">DoubleRenderError</a></dt>
<dd><p>Error thrown when a controller calls a rendering method multiple times</p>
</dd>
<dt><a href="#Context">Context</a></dt>
<dd><p>The <code>this</code> value available in controllers</p>
</dd>
<dt><a href="#Cookies">Cookies</a></dt>
<dd><p>Cookie handling extended from the <a href="https://github.com/pillarjs/cookies#api"><code>cookies</code> module</a> on npm.
The <code>get</code> and <code>set</code> methods serialize and deserialize the data as JSON.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createConfig">createConfig(file)</a> ⇒ <code>Object</code></dt>
<dd><p>Load the config from the specified path</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RouteJSON">RouteJSON</a></dt>
<dd></dd>
<dt><a href="#IO">IO</a></dt>
<dd><p>A socket.io server</p>
</dd>
<dt><a href="#Socket">Socket</a></dt>
<dd><p>A socket.io socket</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>An HTTP request</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>An HTTP response</p>
</dd>
</dl>

<a name="module_nails"></a>

## nails
Nails, a Rails clone in Node


* [nails](#module_nails)
    * [exports](#exp_module_nails--exports) ⇒ <code>[Server](#Server)</code> ⏏
        * [.Router](#module_nails--exports.Router)
            * [new Router()](#new_module_nails--exports.Router_new)
            * [router.method(path, to, options)](#module_nails--exports.Router+method) ⇒ <code>[RouteJSON](#RouteJSON)</code>
            * [router.request(method, path, to, options)](#module_nails--exports.Router+request) ⇒ <code>[RouteJSON](#RouteJSON)</code>
            * [router.scope(...scopes, f)](#module_nails--exports.Router+scope)
            * [router.ws(path, [to], [options])](#module_nails--exports.Router+ws) ⇒ <code>[RouteJSON](#RouteJSON)</code>
            * [Router.draw(f)](#module_nails--exports.Router.draw) ⇒ <code>Array</code>
        * [.Channel](#module_nails--exports.Channel)
            * [new Channel(options)](#new_module_nails--exports.Channel_new)
            * [channel.params](#module_nails--exports.Channel+params) : <code>Object</code>
            * [channel.socket](#module_nails--exports.Channel+socket) : <code>[Socket](#Socket)</code>
        * [.Connection](#module_nails--exports.Connection)
            * [new Connection(socket, handler)](#new_module_nails--exports.Connection_new)
            * [connection.sock](#module_nails--exports.Connection+sock) : <code>[Socket](#Socket)</code>
        * [.genKey(length)](#module_nails--exports.genKey) ⇒ <code>string</code>

<a name="exp_module_nails--exports"></a>

### exports ⇒ <code>[Server](#Server)</code> ⏏
Call this function to start your Nails app.

**Kind**: Exported member  
**Returns**: <code>[Server](#Server)</code> - The server instance  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> \| <code>string</code> | The options for Nails |

<a name="module_nails--exports.Router"></a>

#### exports.Router
The routing helper

**Kind**: static class of <code>[exports](#exp_module_nails--exports)</code>  

* [.Router](#module_nails--exports.Router)
    * [new Router()](#new_module_nails--exports.Router_new)
    * [router.method(path, to, options)](#module_nails--exports.Router+method) ⇒ <code>[RouteJSON](#RouteJSON)</code>
    * [router.request(method, path, to, options)](#module_nails--exports.Router+request) ⇒ <code>[RouteJSON](#RouteJSON)</code>
    * [router.scope(...scopes, f)](#module_nails--exports.Router+scope)
    * [router.ws(path, [to], [options])](#module_nails--exports.Router+ws) ⇒ <code>[RouteJSON](#RouteJSON)</code>
    * [Router.draw(f)](#module_nails--exports.Router.draw) ⇒ <code>Array</code>

<a name="new_module_nails--exports.Router_new"></a>

##### new Router()
Create the router

<a name="module_nails--exports.Router+method"></a>

##### router.method(path, to, options) ⇒ <code>[RouteJSON](#RouteJSON)</code>
`request()` with `method` prefilled as *method*

**Kind**: instance method of <code>[Router](#module_nails--exports.Router)</code>  
**Returns**: <code>[RouteJSON](#RouteJSON)</code> - The created route  
**See**: [request](#module_nails--exports.Router+request)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to match, matched using `path-to-regexp` |
| to | <code>string</code> | The controller to call, represented as a string |
| options | <code>object</code> | More values to include in the route |

<a name="module_nails--exports.Router+request"></a>

##### router.request(method, path, to, options) ⇒ <code>[RouteJSON](#RouteJSON)</code>
Create a route for an HTTP request.

**Kind**: instance method of <code>[Router](#module_nails--exports.Router)</code>  
**Returns**: <code>[RouteJSON](#RouteJSON)</code> - The created route  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP verb to respond to |
| path | <code>string</code> | The path to match, matched using `path-to-regexp` |
| to | <code>string</code> | The controller to call, represented as a string |
| options | <code>object</code> | More values to include in the route |

<a name="module_nails--exports.Router+scope"></a>

##### router.scope(...scopes, f)
**Kind**: instance method of <code>[Router](#module_nails--exports.Router)</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...scopes | <code>string</code> | The scopes to push onto the router |
| f | <code>function</code> | The callback to call with the router |

<a name="module_nails--exports.Router+ws"></a>

##### router.ws(path, [to], [options]) ⇒ <code>[RouteJSON](#RouteJSON)</code>
**Kind**: instance method of <code>[Router](#module_nails--exports.Router)</code>  
**Returns**: <code>[RouteJSON](#RouteJSON)</code> - The route  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to match |
| [to] | <code>string</code> | The channel to call |
| [options] | <code>Object</code> | Additional options for the route |

<a name="module_nails--exports.Router.draw"></a>

##### Router.draw(f) ⇒ <code>Array</code>
“Draw” the routes. This creates a new router,
passes it to the function, and returns the created routes.

**Kind**: static method of <code>[Router](#module_nails--exports.Router)</code>  
**Returns**: <code>Array</code> - The created routes  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | The function to call to draw the routes. |

<a name="module_nails--exports.Channel"></a>

#### exports.Channel
The class managing a connection. Subclass this in your `channels/` directory
to customize its behavior.

**Kind**: static class of <code>[exports](#exp_module_nails--exports)</code>  

* [.Channel](#module_nails--exports.Channel)
    * [new Channel(options)](#new_module_nails--exports.Channel_new)
    * [channel.params](#module_nails--exports.Channel+params) : <code>Object</code>
    * [channel.socket](#module_nails--exports.Channel+socket) : <code>[Socket](#Socket)</code>

<a name="new_module_nails--exports.Channel_new"></a>

##### new Channel(options)
There is generally no need for you to create your own instance of a channel,
because Nails will create them automatically.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options |
| options.params | <code>Object</code> | The params in the URL |
| options.socket | <code>[Socket](#Socket)</code> | The [socket.io](https://socket.io) socket |

<a name="module_nails--exports.Channel+params"></a>

##### channel.params : <code>Object</code>
The URL params, just like in controllers

**Kind**: instance property of <code>[Channel](#module_nails--exports.Channel)</code>  
<a name="module_nails--exports.Channel+socket"></a>

##### channel.socket : <code>[Socket](#Socket)</code>
The [socket.io](https://socket.io) socket

**Kind**: instance property of <code>[Channel](#module_nails--exports.Channel)</code>  
<a name="module_nails--exports.Connection"></a>

#### exports.Connection
A class that manages a socket connection and creates channels as needed.

**Kind**: static class of <code>[exports](#exp_module_nails--exports)</code>  

* [.Connection](#module_nails--exports.Connection)
    * [new Connection(socket, handler)](#new_module_nails--exports.Connection_new)
    * [connection.sock](#module_nails--exports.Connection+sock) : <code>[Socket](#Socket)</code>

<a name="new_module_nails--exports.Connection_new"></a>

##### new Connection(socket, handler)
You should not need to create an instance of this class yourself. Nails will
create an instance for each WebSocket connection.


| Param | Type | Description |
| --- | --- | --- |
| socket | <code>[Socket](#Socket)</code> | The [socket.io](https://socket.io) socket that is connecting |
| handler | <code>[Handler](#Handler)</code> | The handler object to use to find channels |

<a name="module_nails--exports.Connection+sock"></a>

##### connection.sock : <code>[Socket](#Socket)</code>
The [socket.io](https://socket.io) socket

**Kind**: instance property of <code>[Connection](#module_nails--exports.Connection)</code>  
<a name="module_nails--exports.genKey"></a>

#### exports.genKey(length) ⇒ <code>string</code>
Generate a (hopefully) cryptographically secure random secret key

**Kind**: static method of <code>[exports](#exp_module_nails--exports)</code>  
**Returns**: <code>string</code> - The random key  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of key to generate. Default: 50 |

<a name="Handler"></a>

## Handler
Routing handler

**Kind**: global class  

* [Handler](#Handler)
    * [new Handler(config)](#new_Handler_new)
    * [handler.routes](#Handler+routes) : <code>Object</code>
    * [handler.config](#Handler+config) : <code>Object</code>
    * [Handler.exports.getStaticContent(name, config)](#Handler.exports.getStaticContent) ⇒ <code>Promise.&lt;?string&gt;</code>
    * [Handler.exports.getView(route, config)](#Handler.exports.getView) ⇒ <code>Promise.&lt;?function()&gt;</code>
    * [Handler.exports.renderer(req, res, opts)](#Handler.exports.renderer)

<a name="new_Handler_new"></a>

### new Handler(config)
You should not need to create instances of this class yourself.
Nails will automatically create one for you.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The config object |

<a name="Handler+routes"></a>

### handler.routes : <code>Object</code>
The route objects

**Kind**: instance property of <code>[Handler](#Handler)</code>  
<a name="Handler+config"></a>

### handler.config : <code>Object</code>
The config object

**Kind**: instance property of <code>[Handler](#Handler)</code>  
<a name="Handler.exports.getStaticContent"></a>

### Handler.exports.getStaticContent(name, config) ⇒ <code>Promise.&lt;?string&gt;</code>
**Kind**: static method of <code>[Handler](#Handler)</code>  
**Returns**: <code>Promise.&lt;?string&gt;</code> - The file content, or `null` if there was a problem  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The file path to load |
| config | <code>Object</code> | The nails config |

<a name="Handler.exports.getView"></a>

### Handler.exports.getView(route, config) ⇒ <code>Promise.&lt;?function()&gt;</code>
**Kind**: static method of <code>[Handler](#Handler)</code>  
**Returns**: <code>Promise.&lt;?function()&gt;</code> - The template function, or `undefined`
if there was a problem  
**See**: [_.template in the Lodash docs](http://devdocs.io/lodash~4/index#template)  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>string</code> | The `to` value for the route |
| config | <code>Object</code> | The nails config |

<a name="Handler.exports.renderer"></a>

### Handler.exports.renderer(req, res, opts)
**Kind**: static method of <code>[Handler](#Handler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>[Request](#Request)</code> | The HTTP request |
| res | <code>[Response](#Response)</code> | The HTTP response |
| opts | <code>Object</code> | The options This renders the response to a request. |

<a name="Route"></a>

## Route
Object representing a route at runtime

**Kind**: global class  
<a name="new_Route_new"></a>

### new Route(path, [options])

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to match |
| [options] | <code>Object</code> | The options to pass to `path-to-regexp` |

<a name="Server"></a>

## Server
HTTP Server handler

**Kind**: global class  

* [Server](#Server)
    * [new Server(config)](#new_Server_new)
    * [server.run()](#Server+run)
    * [server._run()](#Server+_run)
    * [server._handleRequest(req, res)](#Server+_handleRequest)

<a name="new_Server_new"></a>

### new Server(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The nails config |

<a name="Server+run"></a>

### server.run()
Start the HTTP server when everything is ready

**Kind**: instance method of <code>[Server](#Server)</code>  
<a name="Server+_run"></a>

### server._run()
Start the HTTP server for real

**Kind**: instance method of <code>[Server](#Server)</code>  
<a name="Server+_handleRequest"></a>

### server._handleRequest(req, res)
Handle an incoming request

**Kind**: instance method of <code>[Server](#Server)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>[Request](#Request)</code> | The HTTP Request |
| res | <code>[Response](#Response)</code> | The HTTP Response |

<a name="Auth"></a>

## Auth
HTTP auth checker and deserializer

**Kind**: global class  
**Access**: public  

* [Auth](#Auth)
    * [auth.name](#Auth+name) : <code>string</code>
    * [auth.pass](#Auth+pass) : <code>string</code>
    * [auth.invalid](#Auth+invalid) : <code>boolean</code>
    * [auth.check(user, pass)](#Auth+check) ⇒ <code>boolean</code>
    * [auth.enable(options)](#Auth+enable)

<a name="Auth+name"></a>

### auth.name : <code>string</code>
The username provided

**Kind**: instance property of <code>[Auth](#Auth)</code>  
<a name="Auth+pass"></a>

### auth.pass : <code>string</code>
The password provided

**Kind**: instance property of <code>[Auth](#Auth)</code>  
<a name="Auth+invalid"></a>

### auth.invalid : <code>boolean</code>
Is the authentication possibly valid?

**Kind**: instance property of <code>[Auth](#Auth)</code>  
<a name="Auth+check"></a>

### auth.check(user, pass) ⇒ <code>boolean</code>
Check the username and password in a semi-timing-safe manner

**Kind**: instance method of <code>[Auth](#Auth)</code>  
**Returns**: <code>boolean</code> - Did the username and password sent match `user` and `pass`?  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The username to check |
| pass | <code>string</code> | The password to check |

<a name="Auth+enable"></a>

### auth.enable(options)
**Kind**: instance method of <code>[Auth](#Auth)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | The options |
| [options.realm] | <code>string</code> | <code>&quot;config.appName&quot;</code> | The realm name to send to the user |

<a name="Expires"></a>

## Expires
Class handling expiry of the response

**Kind**: global class  

* [Expires](#Expires)
    * [new Expires(cache)](#new_Expires_new)
    * [expires.in()](#Expires+in)
    * [expires.now()](#Expires+now)

<a name="new_Expires_new"></a>

### new Expires(cache)

| Param | Type | Description |
| --- | --- | --- |
| cache | <code>Object</code> | The cache manager to attach to |

<a name="Expires+in"></a>

### expires.in()
Set the response to expire after the given duration.
See [`moment#add()`](http://devdocs.io/moment/index#manipulating-add) for parameter documentation

**Kind**: instance method of <code>[Expires](#Expires)</code>  
<a name="Expires+now"></a>

### expires.now()
Set the response to expire immediately and not be cached.

**Kind**: instance method of <code>[Expires](#Expires)</code>  
<a name="Cache"></a>

## Cache
Class handling caching

**Kind**: global class  
<a name="Cache.expires"></a>

### Cache.expires : <code>[Expires](#Expires)</code>
**Kind**: static property of <code>[Cache](#Cache)</code>  
<a name="DoubleRenderError"></a>

## DoubleRenderError
Error thrown when a controller calls a rendering method multiple times

**Kind**: global class  
<a name="new_DoubleRenderError_new"></a>

### new DoubleRenderError(message)

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The error message |

<a name="Context"></a>

## Context
The `this` value available in controllers

**Kind**: global class  

* [Context](#Context)
    * [new Context(library)](#new_Context_new)
    * [context.auth](#Context+auth) : <code>[Auth](#Auth)</code>
    * [context.cookies](#Context+cookies) : <code>[Cookies](#Cookies)</code>
    * [context.params](#Context+params) : <code>Object</code>
    * [context.cache](#Context+cache) : <code>[Cache](#Cache)</code>
    * [context.rendered](#Context+rendered) ⇒ <code>boolean</code>
    * [context.render([opts], [content])](#Context+render)
    * [context.redirect(to)](#Context+redirect)
    * [context.static(...components)](#Context+static) ⇒ <code>string</code>
    * [context.stream(options)](#Context+stream)

<a name="new_Context_new"></a>

### new Context(library)

| Param | Type | Description |
| --- | --- | --- |
| library | <code>[Library](#new_Library_new)</code> | The library to attach to |

<a name="Context+auth"></a>

### context.auth : <code>[Auth](#Auth)</code>
The HTTP authentication provided

**Kind**: instance property of <code>[Context](#Context)</code>  
<a name="Context+cookies"></a>

### context.cookies : <code>[Cookies](#Cookies)</code>
Cookies sent by the client

**Kind**: instance property of <code>[Context](#Context)</code>  
<a name="Context+params"></a>

### context.params : <code>Object</code>
The query params in the URL

**Kind**: instance property of <code>[Context](#Context)</code>  
<a name="Context+cache"></a>

### context.cache : <code>[Cache](#Cache)</code>
Control how other servers cache the response

**Kind**: instance property of <code>[Context](#Context)</code>  
<a name="Context+rendered"></a>

### context.rendered ⇒ <code>boolean</code>
**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>boolean</code> - Has the controller rendered its view?  
<a name="Context+render"></a>

### context.render([opts], [content])
Render content to the user

**Kind**: instance method of <code>[Context](#Context)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Object</code> | The options |
| [content] | <code>string</code> | The HTML content to render |

<a name="Context+redirect"></a>

### context.redirect(to)
Redirect to the specified location

**Kind**: instance method of <code>[Context](#Context)</code>  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>Object</code> \| <code>string</code> | The location to redirect to. If `to` is a string, redirect to that path/URL If `to` is an object with a `back` key, redirect to the previous page, or the value of the `back` key if the referrer isn’t present. |

<a name="Context+static"></a>

### context.static(...components) ⇒ <code>string</code>
Get the path to a static file

**Kind**: instance method of <code>[Context](#Context)</code>  
**Returns**: <code>string</code> - The absolute path to the static file  

| Param | Type | Description |
| --- | --- | --- |
| ...components | <code>string</code> | The path components to join together |

<a name="Context+stream"></a>

### context.stream(options)
Stream something to the response.
This function is also a writable stream, so streams
can be piped into it:
`myStream.pipe(this.stream)`

**Kind**: instance method of <code>[Context](#Context)</code>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options |
| [options.path] | <code>string</code> | The path to a file to stream into the response |

<a name="Cookies"></a>

## Cookies
Cookie handling extended from the [`cookies` module](https://github.com/pillarjs/cookies#api) on npm.
The `get` and `set` methods serialize and deserialize the data as JSON.

**Kind**: global class  
<a name="Cookies+delete"></a>

### cookies.delete(key)
**Kind**: instance method of <code>[Cookies](#Cookies)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to delete |

<a name="createConfig"></a>

## createConfig(file) ⇒ <code>Object</code>
Load the config from the specified path

**Kind**: global function  
**Returns**: <code>Object</code> - the loaded object  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | The path to the config file |

<a name="RouteJSON"></a>

## RouteJSON
**Kind**: global typedef  

* [RouteJSON](#RouteJSON)
    * [.ws](#RouteJSON.ws) : <code>boolean</code>
    * [.type](#RouteJSON.type) : <code>string</code>
    * [.url](#RouteJSON.url) : <code>string</code>
    * [.to](#RouteJSON.to) : <code>string</code>

<a name="RouteJSON.ws"></a>

### RouteJSON.ws : <code>boolean</code>
Is this route for a WebSocket connection
instead of an HTTP request?

**Kind**: static property of <code>[RouteJSON](#RouteJSON)</code>  
<a name="RouteJSON.type"></a>

### RouteJSON.type : <code>string</code>
Which HTTP verb should this route respond to?

This member is required unless `ws` is true.

**Kind**: static property of <code>[RouteJSON](#RouteJSON)</code>  
<a name="RouteJSON.url"></a>

### RouteJSON.url : <code>string</code>
What path should the route respond to?

This supports [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)-style
path matching.

**Kind**: static property of <code>[RouteJSON](#RouteJSON)</code>  
<a name="RouteJSON.to"></a>

### RouteJSON.to : <code>string</code>
Which controller should be called?

**Kind**: static property of <code>[RouteJSON](#RouteJSON)</code>  
<a name="IO"></a>

## IO
A socket.io server

**Kind**: global typedef  
**See**: the [`Server` docs](https://socket.io/docs/server-api/#server)  
<a name="Socket"></a>

## Socket
A socket.io socket

**Kind**: global typedef  
**See**: the [`Socket` docs](https://socket.io/docs/server-api/#socket)  
<a name="Request"></a>

## Request
An HTTP request

**Kind**: global typedef  
**See**: the [`http.IncomingMessage` docs](http://devdocs.io/node~6_lts/http#http_class_http_incomingmessage)  
<a name="Response"></a>

## Response
An HTTP response

**Kind**: global typedef  
**See**: the [`http.ServerResponse` docs](http://devdocs.io/node~6_lts/http#http_class_http_serverresponse)  
