# Controllers
This document covers any controllers in a Nails project.

### Format
Controllers are Node.JS JavaScript files, and should be stored in the `controllers` directory within the root of a Nails
project.

### Standard Library
All controllers have access to the Node standard library, but you will need to `require()` any components of it that you
need. Refer to the Node.JS docs for further information about the library and requires.

### Public Methods Are Actions
Any method you make public by exporting it is eligible to be an action (a route's processing function) if it is
specified in a route.

### Action Format
An action must take the form of a function that accepts two parameters. The first of these, `req`, is the HTTP request
as passed to the Nails server. This is a Node.JS `http.IncomingMessage` object, the documentation for which is available
[here](https://nodejs.org/api/http.html#http_class_http_incomingmessage). The second, `render`, is a function that you
should call once you're done processing to render the content you want.

**Example:**
```js
exports.index = function (req, render) {
  render({text: req.headers['user-agent']});
};
```

### Rendering
The renderer that is passed to your actions supports a similar but smaller set of options to Rails' render method, if
you're familiar with that. Its signature is this:

```js
render(opts, content)
```

Pass options as the `opts` object; pass any HTML content in the `content` parameter. If you don't want to pass options,
but have HTML content to render, you can just pass the content as the first parameter; Nails will detect this
automatically.

The `opts` object supports the following options:

 - **`text`** *(type: `String`)*  
   Specifies a string of plain text to render in the HTTP response. Incompatible with the `json` option; if both are
   specified, `text` takes priority. Incompatible with the `view` option; if both are specified, `text` takes priority.
 - **`json`** *(type: `Object` or `Array`)*  
   Specifies an object to stringify and render as JSON in the HTTP response. The response will have a `Content-Type` of
   `application/json`. Incompatible with the `view` option; if both are specified, `json` takes priority.
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
exports.remoteAjax = function (req, render) {
  render({
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
exports.badRequest = function (req, render) {
  render({
    text: 'Failed',
    status: 409
  });
};
```