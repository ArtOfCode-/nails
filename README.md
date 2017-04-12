# Nails [![Travis](https://img.shields.io/travis/ArtOfCode-/nails.svg?style=flat-square)](https://travis-ci.org/ArtOfCode-/nails) [![MIT license](https://img.shields.io/github/license/ArtOfCode-/nails.svg?style=flat-square)](https://github.com/ArtOfCode-/nails/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/node-nails.svg?style=flat-square)](https://www.npmjs.com/package/node-nails) [![GitHub contributors](https://img.shields.io/github/contributors/ArtOfCode-/nails.svg?style=flat-square)](https://github.com/ArtOfCode-/nails/graphs/contributors)

Proof-of-concept for a Rails-like thing in Node.js.

## Install/Use
 1. Install the package: `npm install node-nails`
 2. Create your app. There's a tiny sample app included with the nails package under app/. Make sure your app's root
    directory has a `config.json` in it - this is where nails will try to load config from.
 3. In your startup script:

    ```js
    var nails = require("node-nails");
    nails();
    ```

    It should Just Work from that point, if your app is constructed correctly.

## Getting Started
There is brief documentation available below in the README. If, however, you want a step-by-step guide to getting a
project set up, you can read through the
[getting started manual](https://github.com/ArtOfCode-/nails/blob/master/docs/getting-started.md).

Full documentation for the project is available in the
[docs folder](https://github.com/ArtOfCode-/nails/tree/master/docs).

## Documentation
If you've moved beyond the level of the getting started guide or just want some more information about what's available
in Nails, full documentation is available [from the docs folder](https://artofcode-.github.io/nails).

## Bugs/Suggestions
If you've got comments, think you've found a bug, or would like to request a feature for Nails, please create a new
issue on this repository, and I'll have a look.

## License
Nails is licensed under the MIT license.
