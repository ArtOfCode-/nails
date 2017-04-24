---
title: Routing from JavaScript
---

Nails provides a handy library that lets you create routes with pure JS.

To use this library:

```js
const { Router } = require('node-nails');
module.exports = Router.draw(router => {
  // define your routes here
})
```
The `router` object passed to the function (it’s also the `this` value if you use a regular function) has several methods to help you create routes:

* <code>request(*method*, *path*, *options*)</code>
  * *`method`*: a valid HTTP verb
  * *`path`*: the path to match
  * *`options`*: an object of other options
    * *`to`*: the controller to render (default: *`path`*)
* <code>*method*(*path*[, *to*]\[, *options*])</code>
  * *`method`*: a valid lowercase HTTP verb
  * *`path`*: the path to match
  * *`to`*: the controller to render
  * *`options`*: an object of other options
* <code>scope(*scope*, *function*)</code>
  * *`scope`*: the scope component to add
  * *`function`*: the function to call in this scope. The function is passed the router as its first argument and `this` value.
  * Example:
    ```js
    scope('status', ({ get }) => {
      get('', 'index') // matches /status, routes to status.index
    })
    ```
    is equivalent to:
    ```js
    get('status', 'status.index')
    ```

# Routes as JSON
### Format
The routes file can be either JavaScript or JSON (or CoffeeScript, with a call to `require('coffee-script/register')`). The JSON variant should be formatted as one top level *array* containing any number of route *objects*; the script variants should *export* an equivalent array. The JavaScript helper above can be used to dynamically generate this file to prevent errors.

### Required Keys
In *each* route object, the following keys are **required**:

 - **`type`** *(type: `String`)*  
   Defines the HTTP method that this route will respond to. Must be one of `HEAD`, `OPTIONS`, `GET`, `POST`, `PATCH`,
   `PUT`, or `DELETE`.
 - **`url`** *(type: `String`)*  
   Defines the pathname component of the URL (after the host and before the query) that this route will respond to. A
   `url` of `/status` will respond to `/status` and to `/status?query=xyz`, but not to `/status/json`. This can use express-style `:` variables (`/a/:b` will set `this.params.b` in the controller).
 - **`to`** *(type: `String`)*  
   Defines the controller and function that will handle requests that match this route. Must be provided in the format
   `controller.function`: for a route handled by the `index` function in the `status` controller, the value of this key
   should be `status.index`.

### Example File
**JSON:**
```json
[
  { "type": "GET", "url": "/status", "to": "status.index" },
  { "type": "GET", "url": "/status/new", "to": "status.new" },
  { "type": "POST", "url": "/status/new", "to": "status.create" }
]
```

**JavaScript:**
```js
exports = module.exports = [
  { type: "GET", url: "/status", to: "status.index" },
  { type: "GET", url: "/status/new", to: "status.new" },
  { type: "POST", url: "/status/new", to: "status.create" }
];
```
