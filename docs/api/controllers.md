---
title: Controllers
---

### Format
Controllers are Node.JS JavaScript files, and should be stored in the `controllers` directory within the root of a Nails project.

### Standard Library
All controllers have access to the Node standard library, but you will need to `require()` any components of it that you need. Refer to the Node.JS docs for further information about the library and requires.

### Public Methods Are Actions
Any method you make public by exporting it is eligible to be an action (a route's processing function) if it is specified in a route.

### Action Format
An action must take the form of a function that accepts one parameter. This parameter, `req`, is the HTTP request as passed to the Nails server. This is a Node.JS `http.IncomingMessage` object, the documentation for which is available
[here](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

The action will be executed in the context of Nails' controller library, which gives you access to controller helper
methods including `this.render` (as demonstrated in the example below) and `this.redirect`.

**Example:**
```js
exports.index = function (req) {
  this.render({text: req.headers['user-agent']});
};
```

### Rendering
The renderer available in the library (`this.render` in your controllers) supports a similar but smaller set of options
to Rails' `render` method, if you're familiar with that. Its signature is this:

```js
this.render(opts, content)
```

Pass options as the `opts` object; pass any HTML content in the `content` parameter. If you don't want to pass options,
but have HTML content to render, you can just pass the content as the first parameter; Nails will detect this
automatically.

The `opts` object supports the following options:

 - **`text`** *(type: `String`)*  
   Specifies a string of plain text to render in the HTTP response. Incompatible with the `json` option; if both are
   specified, `text` takes priority. Incompatible with the `content` option; if both are specified, `text` takes
   priority. Incompatible with the `view` option; if both are specified, `text` takes priority.
 - **`json`** *(type: `Object` or `Array`)*  
   Specifies an object to stringify and render as JSON in the HTTP response. The response will have a `Content-Type` of
   `application/json`. Incompatible with the `content` option; if both are specified, `json` takes priority.
   Incompatible with the `view` option; if both are specified, `json` takes priority.
 - **`content`** *(type: `String`)*
   Specifies a string of HTML to render in the HTTP response. Incompatible with the `view` option; if both are
   specified, `html` takes priority.
 - **`headers`** *(type: `Object`)*  
   Specifies a list of key-value pairs to send as HTTP headers in the response; keys are header names, and values are
   their values. Specifying the `text` or `json` options overrides any `Content-Type` option set here.
 - **`status`** *(type: `Integer`)*  
   Specifies the HTTP status code to return in the response. Defaults to 200 (OK) if not specified, and may be
   overridden in the case of errors or unexpected circumstances (for example, a nonexistent view with the `view` option
   set will send 204 (No Content)).
 - **`view`** *(type: `Boolean`)*  
   Specifies whether the view associated with this action should be rendered. Defaults to `false`.
 - **`locals`** *(type: `Object`)*  
   Specifies a set of variables that will be accessible in the associated view. Has no effect unless the `view` option
   is set to `true`.

**Example:** An AJAX request returns JSON with an access control header:
```js
exports.remoteAjax = function (req) {
  this.render({
    json: {
      date: new Date().toISOString()
    },
    headers: {
      'Access-Control-Allow-Origin', '*'
    }
  });
};
```

**Example:** A failed request returns a plain string with a status code:
```js
exports.badRequest = function (req) {
  this.render({
    text: 'Failed',
    status: 409
  });
};
```

### Redirects
The other major method available in the Nails library is `redirect`. From your controller actions, you can call
`this.redirect(path)` to redirect the client to another path. The value of `path` should be a string containing a path
(for a redirect to elsewhere in your application) or a full URL (for redirection elsewhere on the Internet).

The HTTP response for this will be a 302 Found response with a Location header pointing to your specified resource.

#### <code>redirect({ back: *path* })</code>
Redirect back to the previous page, or *`path`* if the HTTP Referer header is not set.

### Cookies
Nails supports cookies (`this.cookies`), using the [`cookies`](https://github.com/pillarjs/cookies) module from `npm`, with some modifications:

#### <code>cookies.delete(*name*)</code>
Delete the cookie sent under the specified *`name`*.

#### <code>cookies.set(*name*, *value*, *options*?)</code>
Set the cookie with the *`value`* encoded using JSON.

#### <code>cookies.get(...)</code>
Decode the cookie’s value using JSON, throwing if it isn’t valid JSON.

### Headers

#### <code>header(*name*, *value*)</code>
See [the Node docs](http://devdocs.io/node~6_lts/http#http_response_setheader_name_value)

#### <code>header.get(*name*)</code>
See [the Node docs](http://devdocs.io/node~6_lts/http#http_response_getheader_name)

#### <code>header.remove(*name*)</code>
#### <code>header.del(*name*)</code>
See [the Node docs](http://devdocs.io/node~6_lts/http#http_response_removeheader_name)

### Authentication

#### <code>auth.enable({ *realm*? })</code>
Require authentication on this page. The default *`realm`* is the directory the start script is in.

#### `auth.name`
The username provided by the auth dialog box

#### `auth.pass`
The password provided by the auth dialog box

#### <code>auth.check(*username*, *password*)</code>
Check the password, in a timing-safe manner.

### Querystrings

The querystring in the URL is parsed using the Node core `querystring` module and stored in `this.query`. (**Release blocker**: This will switch to the `qs` module for compatibility with Rails)
