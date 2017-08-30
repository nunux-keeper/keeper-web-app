# NUNUX Keeper Web App

> Your personal content curation service.

Nunux Keeper allow you to collect, organize, and display web documents.

**This project is the official web frontend.**

![Screenshot](screenshot.png)

## Table of Contents
1. [Requirements](#requirements)
1. [Features](#features)
1. [Installation](#installation)
1. [Development server](#development-server)
1. [Other commands](#other-commands)
1. [Under the hood](#under-the-hood)
1. [Structure](#structure)

## Requirements

Docker OR Node `^5.0.0`


## Features

* Welcome page
* Login with external identity provider (Google, Twitter, etc.)
* Manage labels to organize documents
* Create document from scratch or from a remote location
* Create document from another website thanks to the bookmarklet
* Search documents with a powerful search engine
* Share documents

## Configuration

Basic project configuration can be found in `etc/dev.env`. Here you'll be able
to redefine some parameters:

* REACT_APP_API_ROOT: Nunux Keeper API endpoint
* REACT_APP_DEBUG: Activate debug mode

## Installation

> Note that this project is "only" the web front end of the backend API of Linux
> Keeper. If you want to use your own API server you have to install first this
> project: [keeper-core-api](https://github.com/nunux-keeper/keeper-core-api)

Once configured for your needs (see section above), you can build the static
Web App into the directory of your choice:

```bash
$ git clone https://github.com/nunux-keeper/keeper-web-app.git
$ cd keeper-web-app
$ make install DEPLOY_DIR=/var/www/html
```

Then, you can serve this directory with your favorite HTTP server.

## Development server

With Node:

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
$ make image start  # Build Docker image and start it
```

## Other commands

Here's a brief summary of available Docker commands:

* `make help` - Show available commands.
* `make volume` - Create development volume.
* `make image` - Build Docker image.
* `make shell` - Start container with shell access.
* `make mount shell` - Start container with shell access using the dev volume.
* `make start` - Start container in background.
* `make mount start` - Start container in background using the dev volume.
* `make stop` - Stop background running container.
* `make logs` - View container logs.
* `make rm` - Removing the container.
* `make clean` - Removing the container and the image.
* `make install` - Install generated site into the deployment directory.

Here's a brief summary of available NPM commands:

* `npm start` - Start development server.
* `npm run build` - Compiles the application to disk (`~/build`).
* `npm run test` - Runs unit tests.
* `npm run build-css`- Runs SASS to generate CSS file.

## Under the hood

* [React](https://github.com/facebook/react)
* [Redux](http://redux.js.org/)
* [React Router](https://github.com/ReactTraining/react-router)
* [React Create App](https://github.com/facebookincubator/create-react-app)
* [Sass](http://sass-lang.com/)
* [ESLint](http://eslint.org)


## Structure

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
