# nails
Proof-of-concept for a Rails-like thing in Node.js.

## Install/Use
 1. Install the package: `npm install node-nails`
 2. Create your app. There's a tiny sample app included with the nails package under app/. Make sure your app's root
    directory has a `config.json` in it - this is where nails will try to load config from.
 3. In your startup script:

    ```js
    var nails = require("node-nails").nails;
    nails('/path/to/your/app/root');    // no need to include a trailing slash
    ```

    It should Just Work from that point, if your app is constructed correctly.

## Config
In your app's root directory, there must be a `config.json` file. That file should have *at least* the following in it:

```json
{
  "server_interface": "127.0.0.1",
  "server_port": 8080
}
```

`server_interface` is the network address that nails will bind to - 127.0.0.1 for localhost, or specify 0.0.0.0 for
"unspecified"/"all". `server_port` is the port that nails will run on. The configuration in this example would end up in
a nails server accessible at `http://localhost:8080/`.

## Routes & Controllers
Your app's root directory should *also* contain a `routes.json` file, like Rails' `config/routes.rb`. This file
specifies what URL paths route to what controllers and methods. Its structure looks like this:

```json
[
  { "type": "GET", "url": "/", "to": "dashboard.index" }
]
```

This routing assumes that you have a controller in `controllers/dashboard.js`, and that you have exported an `index`
method from there, i.e.

```js
exports.index = function (req, render) {
  // ...
};
```

Each action in your controllers should be a function that accepts two parameters, `req` and `render`, like the above
example. `req` is the request received by the HTTP server, exactly as Node specifies it
([documentation](https://nodejs.org/api/http.html#http_class_http_incomingmessage)). `render` is the renderer function,
which you should call once you're done processing to tell nails what to render. This accepts two parameters, `opts` and
`content`. If you don't want to pass any options, you can also just pass `content` as the first parameter. `opts`
supports a similar but smaller set of options to Rails' `render` - `text` and `json`, for example. You can also pass a
`headers` object here to set headers in the response. Nails will assume you're passing content here by default, but if
you've got a corresponding view you'd like to render instead, add `view: true` to the `opts` object and it'll be
rendered.

## Views
Views also work similarly to Rails. Views in nails use EJS as the templating language instead of ERB, but the syntax is
almost identical:

```ejs
<h1><%= headerText %></h1>
```

That will render the contents of the `headerText` variable into the `<h1>` tag. You can set local variables for your
views as an option to your controller's `render` call: `render({view: true, locals: {headerText: 'hello'}})`.
