# Nails _(node-nails)_

[![Travis](https://img.shields.io/travis/ArtOfCode-/nails.svg?style=flat-square)](https://travis-ci.org/ArtOfCode-/nails)
[![Codecov](https://img.shields.io/codecov/c/github/ArtOfCode-/nails.svg?style=flat-square)](https://codecov.io/gh/ArtOfCode-/nails)
[![MIT license](https://img.shields.io/github/license/ArtOfCode-/nails.svg?style=flat-square)](https://github.com/ArtOfCode-/nails/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/node-nails.svg?style=flat-square)](https://www.npmjs.com/package/node-nails)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Greenkeeper badge](https://badges.greenkeeper.io/ArtOfCode-/nails.svg)](https://greenkeeper.io/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)


[![NPM](https://nodei.co/npm/node-nails.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-nails/) [![NPM](https://nodei.co/npm-dl/node-nails.png?months=3&height=3)](https://nodei.co/npm/node-nails/)


> Better-than-expected Rails clone in Node


Proof-of-concept for a Rails-like thing in Node.js.

## Install

This project uses [Node](https://nodejs.org) and [npm](https://npmjs.com)

```
npm i --save node-nails
```

## Usage
 1. Create your app. There's a tiny sample app included with the nails package under app/. Make sure your app's root
    directory has a `config.json` in it - this is where nails will try to load config from.
 1. In your startup script:

    ```js
    var nails = require("node-nails");
    nails();
    ```

    It should Just Work from that point, if your app is constructed correctly.
For more detailed steps, see [the getting started guide](https://github.com/ArtOfCode-/nails/blob/master/docs/getting-started.md).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/10406565?v=3" width="100px;"/><br /><sub>ArtOfCode</sub>](http://artofcode.co.uk/)<br />[💻](https://github.com/ArtOfCode-/nails/commits?author=ArtOfCode- "Code") [📖](https://github.com/ArtOfCode-/nails/commits?author=ArtOfCode- "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/25517624?v=3" width="100px;"/><br /><sub>J F</sub>](https://j-f1.github.io)<br />[💻](https://github.com/ArtOfCode-/nails/commits?author=j-f1 "Code") [📖](https://github.com/ArtOfCode-/nails/commits?author=j-f1 "Documentation") [⚠️](https://github.com/ArtOfCode-/nails/commits?author=j-f1 "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!


## API

See [the docs online](https://artofcode-.github.io/nails)

## Maintainers

@j-f1 and @ArtOfCode-

## Contribute

Feel free to dive in! Ask questions or request improvements by [opening an issue](https://github.com/ArtOfCode-/nails/issues/new).

[![PRs accepted](https://img.shields.io/badge/PRs-accepted-brightgreen.svg?style=flat-square)](https://github.com/ArtOfCode-/nails/fork)

`nails` follows the [Contributor Covenant](http://contributor-covenant.org/version/1/4) Code of Conduct.

## License
[MIT](https://github.com/ArtOfCode-/nails/blob/master/LICENSE) © ArtOfCode & Jed Fox
