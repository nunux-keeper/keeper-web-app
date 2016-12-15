NUNUX Keeper Web App
====================

> Your personal content curation service.

Nunux Keeper allow you to collect, organize, and display web documents.
This project is the official web frontend.

![Screenshot](screenshot.png)

Table of Contents
-----------------
1. [Requirements](#requirements)
1. [Features](#features)
1. [Getting Started](#getting-started)
1. [Usage](#usage)
1. [Under the hood](#under-the-hood)
1. [Structure](#structure)
1. [Configuration](#configuration)
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
$ git clone https://github.com/nunux-keeper/keeper-web-app.git
$ cd keeper-web-app
$ npm install       # Install Node modules listed in ./package.json (may take a
                    # while the first time)
$ npm start         # Compile and launch
```

Or with Docker:

```shell
$ git clone https://github.com/nunux-keeper/keeper-web-app.git
$ cd keeper-web-app
$ make build start logs  # Build Docker image and start it
```


Usage
-----

Here's a brief summary of available Docker commands:

* `make help` - Show available commands.
* `make volume` - Create development volume.
* `make build` - Build Docker image.
* `make shell` - Start container with shell access.
* `make mount shell` - Start container with shell access using the dev volume.
* `make start` - Start container in background.
* `make mount start` - Start container in background using the dev volume.
* `make stop` - Stop background running container.
* `make logs` - View container logs.
* `make rm` - Removing the container.
* `make clean` - Removing the container and the image.
* `make install` - Install container as a systemd service.

Here's a brief summary of available NPM commands:

* `npm start` - Start development server.
* `npm run build` - Compiles the application to disk (`~/build`).
* `npm run test` - Runs unit tests.
* `npm run build-css`- Runs SASS to generate CSS file.

Under the hood
--------------

* [React](https://github.com/facebook/react)
* [Redux](http://redux.js.org/)
* [React Router](https://github.com/ReactTraining/react-router)
* [React Create App](https://github.com/facebookincubator/create-react-app)
* [Sass](http://sass-lang.com/)
* [ESLint](http://eslint.org)


Structure
---------

Here the folder structure:

```
.
├── build               # Builded website
├── dockerfiles         # Docker files
├── public              # Static files to serve as is
├── src                 # Application source code
│   ├── api             # Backend API connector (real and mock)
│   ├── components      # App components
│   ├── layouts         # Components that dictate major page structure
│   ├── middlewares     # Components that provide context and AuthN
│   ├── store           # Redux store
│   │   └── modules     # Redux modules
│   ├── styles          # Application-wide styles
│   ├── views           # Components that live at a route
│   ├── App.js          # Application bootstrap and rendering
│   ├── Routes.js       # Application routes
│   └── index.js        # Application entry point
└── test                # Unit tests
```

Configuration
-------------

Basic project configuration can be found in `.env`. Here you'll be able to
redefine some parameters:

* REACT_APP_API_ROOT: Nunux Keeper API endpoint
* REACT_APP_DEBUG: Activate debug mode

Deployment
----------

Out of the box, this app is deployable by serving the `~/build` folder generated
by `npm run build`.

----------------------------------------------------------------------

NUNUX Keeper

Copyright (c) 2017 Nicolas CARLIER (https://github.com/ncarlier)

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
