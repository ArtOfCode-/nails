# Nails
Proof-of-concept for a Rails-like thing in Node.js.

## Install/Use
 1. Install the package: `npm install node-nails`
 2. Create your app. There's a tiny sample app included with the nails package under app/. Make sure your app's root
    directory has a `config.json` in it - this is where nails will try to load config from.
 3. In your startup script:

    ```js
    var nails = require("node-nails").nails;
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

    Copyright (c) 2017 ArtOfCode

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
