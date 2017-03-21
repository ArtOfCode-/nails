# nails
Proof-of-concept for a Rails-like thing in Node.js.

### Wha..?
Start with `index.js` - that's the entry point when the server's launched. The code for managing the HTTP server is in
`server.js`, and the code for routing and processing requests is in `handlers.js`.

The "application" code is under `app/`. Ideally, the server and the application would be separated as they are in Rails,
but that's deferred for now.

### How?
To install for development or testing on your local machine, you'll need a copy of Node.js and npm, node's package
manager. Once you've got those, clone the repo:

    $ git clone https://github.com/ArtOfCode-/nails

Install dependencies:

    $ npm install

Boot the server with:

    $ npm start
