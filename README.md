NUNUX Keeper Web App
====================

> Your personal content curation service.

Nunux Keeper allow you to collect, organize, and display web documents. This
project is the official web frontend.

![Screenshot](screenshot.png)

Table of Contents
-----------------
1. [Requirements](#requirements)
1. [Features](#features)
1. [Getting Started](#getting-started)
1. [Usage](#usage)
1. [Under the hood](#under-the-hood)
1. [Structure](#structure)
1. [Webpack](#webpack)
1. [Server](#server)
1. [Styles](#styles)
1. [Testing](#testing)
1. [Deployment](#deployment)


Requirements
------------

Docker OR Node `^5.0.0`


Features
--------

* Welcome page
* Login with external identity provider (Google, Twitter, etc.)
* Manage labels to organize documents
* Create document from scratch or from a remote location
* Create document from another website thanks to the bookmarklet
* Search documents with a powerful search engine
* Share documents


Getting Started
---------------

Just clone the repo and install the necessary node modules:

```shell
$ git clone https://github.com/ncarlier/keeper-web-app.git
$ cd keeper-web-app
$ npm install       # Install Node modules listed in ./package.json (may take a
                    # while the first time)
$ npm start         # Compile and launch
```

Or with Docker:

```shell
$ git clone https://github.com/ncarlier/keeper-web-app.git
$ cd keeper-web-app
$ make build start logs  # Build Docker image and start it
```


Usage
-----

Here's a brief summary of available commands:

* `make help` - Show available commands.
* `make volume` - Create development volume.
* `make build` - Build Docker image.
* `make shell` - Start container with shell access.
* `make mount shell` - Start container with shell access using the dev volume.
* `make start` - Start container in background.
* `make start` - Start container in background using the dev volume.
* `make stop` - Stop background running container.
* `make logs` - View container logs.
* `make rm` - Removing the container.
* `make clean` - Removing the container and the image.
* `make install` - Install container as a systemd service.

Here's a brief summary of npm available commands:

* `npm run compile` - Compiles the application to disk (`~/dist` by default).
* `npm run dev:nw` - Same as `npm start`, but opens the redux devtools in a new
  window.
* `npm run dev:no-debug` - Same as `npm start` but disables redux devtools.
* `npm run test` - Runs unit tests with Karma and generates a coverage report.
* `npm run test:dev` - Runs Karma and watches for changes to re-run tests; does
   not generate coverage reports.
* `npm run deploy`- Runs linter, tests, and then, on success, compiles your
  application to disk.
* `npm run lint`- Lint all `.js` files.
* `npm run lint:fix` - Lint and fix all `.js` files.


Under the hood
--------------

* [React](https://github.com/facebook/react)
* [Redux](https://github.com/rackt/redux)
  * react-redux
  * redux-devtools
  * redux-thunk middleware
* [react-router](https://github.com/rackt/react-router)
* [redux-simple-router](https://github.com/rackt/redux-simple-router)
* [Webpack](https://github.com/webpack/webpack)
  * [CSS modules!](https://github.com/css-modules/css-modules)
  * sass-loader
  * postcss-loader with cssnano for style autoprefixing and minification
  * Bundle splitting for app and vendor dependencies
  * CSS extraction during builts that are not using HMR (like `npm run compile`)
  * Loaders for fonts and images
* [Babel](https://github.com/babel/babel)
  * [babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) so transforms aren't inlined
  * [babel-preset-react-hmre](https://github.com/danmartinez101/babel-preset-react-hmre) for:
    * react-transform-hmr (HMR for React components)
    * redbox-react (visible error reporting for React components)
* [ESLint](http://eslint.org)
  * Uses [Standard Style](https://github.com/feross/standard) by default, but you're welcome to change this!
  * Includes separate test-specific `.eslintrc` to work with Mocha and Chai


### Configuration

Basic project configuration can be found in `~/config/_base.js`. Here you'll be
able to redefine your `src` and `dist` directories, adjust compilation settings,
tweak your vendor dependencies, and more. For the most part, you should be able
to make changes in here **without ever having to touch the webpack build
configuration**. If you need environment-specific overrides, create a file with
the name of target `NODE_ENV` prefixed by an `_` in `~/config` (see
`~/config/_production.js` for an example).

Common configuration options:

* `dir_src` - application source code base path
* `dir_dist` - path to build compiled application to
* `server_host` - hostname for the Koa server
* `server_port` - port for the Koa server
* `compiler_css_modules` - whether or not to enable CSS modules
* `compiler_source_maps` - whether or not to generate source maps
* `compiler_vendor` - packages to separate into to the vendor bundle

Structure
---------

Here the folder structure:

```
.
├── bin                      # Build/Start scripts
├── build                    # All build-related configuration
│   └── webpack              # Environment-specific configuration files for webpack
├── config                   # Project configuration settings
├── server                   # Koa application (uses webpack middleware)
│   └── main.js              # Server application entry point
├── src                      # Application source code
│   ├── api                  # Backend API connector (real and mock)
│   ├── components           # App components
│   ├── containers           # Components that provide context (e.g. Redux Provider)
│   ├── layouts              # Components that dictate major page structure
│   ├── redux                # Redux-specific pieces
│   │   ├── modules          # Collections of reducers/constants/actions
│   │   └── utils            # Redux-specific helpers
│   ├── routes               # Application route definitions
│   ├── static               # Static assets (not imported anywhere in source code)
│   ├── styles               # Application-wide styles (generally settings)
│   ├── views                # Components that live at a route
│   └── main.js              # Application bootstrap and rendering
└── tests                    # Unit tests
```

Webpack
-------

### Configuration
The webpack compiler configuration is located in `~/build/webpack`. Here you'll
find configurations for each environment; `development` and `production`.

### Vendor Bundle
You can redefine which packages to bundle separately by modifying
`compiler_vendor` in `~/config/_base.js`. These default to:

```js
[
  'history',
  'react',
  'react-redux',
  'react-router',
  'redux-simple-router',
  'redux'
]
```

### Webpack Root Resolve
Webpack is configured to make use of 
[resolve.root](http://webpack.github.io/docs/configuration.html#resolve-root),
which lets you import local packages as if you were traversing from the root of
your `~/src` directory. Here's an example:

```js
// current file: ~/src/views/some/nested/View.js

// What used to be this:
import SomeComponent from '../../../components/SomeComponent'

// Can now be this:
import SomeComponent from 'components/SomeComponent' // Hooray!
```

### Globals

These are global variables available to you anywhere in your source code. If you
wish to modify them, they can be found as the `globals` key in
`~/config/index.js`.

* `process.env.NODE_ENV` - the active `NODE_ENV` when the build started
* `__DEV__` - True when `process.env.NODE_ENV` is `development`
* `__PROD__` - True when `process.env.NODE_ENV` is `production`

Server
------

This starter kit comes packaged with an Koa server. It's important to note that
the sole purpose of this server is to provide `webpack-dev-middleware` and
`webpack-hot-middleware` for hot module replacement.

Styles
------

Both `.scss` and `.css` file extensions are supported out of the box and are
configured to use [CSS Modules](https://github.com/css-modules/css-modules).
After being imported, styles will be processed with
[PostCSS](https://github.com/postcss/postcss) for minification and
autoprefixing, and will be extracted to a `.css` file during production builds.


Testing
-------

To add a unit test, simply create a `.spec.js` file anywhere in `~/tests`.
Karma will pick up on these files automatically, and Mocha and Chai will be
available within your test without the need to import them.

Coverage reports will be compiled to `~/coverage` by default. If you wish to
change what reporters are used and where reports are compiled, you can do so by
modifying `coverage_reporters` in `~/config/_base.js`.

Deployment
----------

Out of the box, this starter kit is deployable by serving the `~/dist` folder
generated by `npm run compile` (make sure to specify your target `NODE_ENV` as
well). This project does not concern itself with the details of server-side
rendering or API structure, since that demands an opinionated structure that
makes it difficult to extend the starter kit. However, if you do need help with
more advanced deployment strategies, here are a few tips:

If you are serving the application via a web server such as nginx, make sure to
direct incoming routes to the root `~/dist/index.html` file and let react-router
take care of the rest. The Koa server that comes with the starter kit is able to
be extended to serve as an API or whatever else you need, but that's entirely up
to you.

----------------------------------------------------------------------

NUNUX Keeper

Copyright (c) 2014 Nicolas CARLIER (https://github.com/ncarlier)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

----------------------------------------------------------------------
