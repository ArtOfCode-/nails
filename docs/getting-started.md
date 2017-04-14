# Getting Started
This guide will take you through installation and creation of a simple nails app.

## 0. Prerequisites
You'll need to have Node.js and npm installed to be able to complete this guide. You can get those from:

 - **Node**: [nodejs.org](https://nodejs.org/en/download/current/)
 - **npm**: should come bundled with your Node installation.

# 1. Download/Install
You'll need to create a new Node project. In an empty directory, run `npm init` and follow the prompts

Replace the values with things that make sense for your project. Then, `cd` into your project directory, and run the
following:
```
$ npm install --save node-nails
```
This will download and install the nails package, and save it in your `package.json` as a dependency for your project.

## 2. Server Script
You need a script that loads nails and tells it where your app is so that it can start serving it. To that end, create a
`server.js` file in your project, and copy this into it:

```js
var nails = require("node-nails");
nails();
```

## 3.1. App: Config
You can start creating your application now. The first thing you'll need is a configuration file, which should be stored
as `config.js` in the `app/` directory of your app. At minimum, it should contain the following:

```js
module.exports = {
  key: "...",
  server_interface: "127.0.0.1",
  server_port: 8080
}
```
To fill in the `key` option, run `require('node-nails').genKey()` in a Node REPL.

These two options dictate which IP address your server will bind to, and which port it will listen on. The example
configuration given here will result in a server available at `http://localhost:8080/`.

## 3.2. App: Routes
The second configuration file you need is your routes file. This is similar to Rails' routes file, if you're familiar
with that. This file should be called `routes.js` and go in the `app` directory, along with
`config.js`.

The routes file defines which function should handle a request to a given URL. For each route, you need to specify

 - the request method (GET, POST, etc)
 - the request URL (which URL this route should respond to)
 - a handling function, which you specify as a string.

For now, put this content in your routes file:

```js
const { Router } = require('node-nails');
module.exports = Router.draw(({ get }) => {
  get('/status', 'status.index');
  get('/status/json', 'status.json');
})
```

The string provided as the second argument to the `get()` function is what specifies the function that will be called for the given method/URL combination. It's composed of the controller name, followed by a dot, followed by the function name.

## 3.3. App: Controllers
The third step in creating this app is to create a controller to handle the routes we just defined. Create a `controllers` directory in the `app` directory, and then create a file called `status.js` within it.

In that file, you'll need this content:

```js
exports.index = function (req) {
  this.render({view: true, locals: {ip: req.connection.remoteAddress, ua: req.headers['user-agent']}});
};

exports.json = function (req) {
  this.render({json: {status: 'up', ip: req.connection.remoteAddress, ua: req.headers['user-agent']}});
};
```

Now the `exports.index` function will respond to requests to `/status`, and the `exports.json` function will respond to
`/status/json`.

## 3.4. App: Views
The final component to this app is creating the one view we need. Notice how, in `controllers/status.js`, in the call to `render`, we specified `view: true`? That makes that action try to render an EJS view. We need to create that view so it can be rendered.

Create a `views` directory in the `app` directory. Within that, create a `status` directory, and within *that* create an `index.ejs` file. Whatever's in this file will be rendered as the HTTP response; the JS embedded in this view will have access to any data you pass in the `locals` option to the `render` call. For now, put this in the file:

```ejs
<h1>It's alive!</h1>
<p>This page was rendered by the <strong>status</strong> controller, using action <strong>index</strong>.</p>
<p>You're connecting from <%= ip %>, with user agent <%= ua %>.</p>
```

## 4. Test it!
You now have a complete nails app. To test it, run your server script using Node:

```
$ node server.js
```

If you've followed this guide, you'll get a confirmation that the nails server is listening on 127.0.0.1, port 8080.
In your browser, go visit http://localhost:8080/status and http://localhost:8080/status/json. For the first one, you
should see the rendered HTML from `views/status/index.ejs` (now containing your IP and user agent), and for the second
you should see JSON data containing `status: 'up'`, and your IP and user agent.

## 5. Hack it!
You're done. Now, take the app you've just made and modify it to do... something else. There's full documentation
available [here](https://artofcode-.github.io/nails) - if you need help, details of what nails does and doesn't support should be in there. Bear in mind that nails is by no means fully-fledged, so there are doubtless some major features lacking.

If you think you've found a bug, or have a question or feature request, please open a [new issue](https://github.com/ArtOfCode-/nails/issues/new) on the GitHub repository.
