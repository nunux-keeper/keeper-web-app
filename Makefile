.SILENT :

# Image name
USERNAME:=ncarlier
APPNAME:=keeper-web-app
env?=dev

# Compose files
COMPOSE_FILES?=-f docker-compose.yml

# Deploy directory
DEPLOY_DIR:=/var/www/html/app.nunux.org/keeper

# Include common Make tasks
root_dir:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
makefiles:=$(root_dir)/makefiles
include $(makefiles)/help.Makefile
include $(makefiles)/docker/compose.Makefile

all: help

# Get Docker binaries version
infos:
	echo "Using $(shell docker --version)"
	echo "Using $(shell docker-compose --version)"
.PHONY: infos

## Build Docker image
build:
	docker build --rm -t $(USERNAME)/$(APPNAME) .
.PHONY: build

## Run the container in test mode
test:
	echo "Running tests..."
	CMD=test docker-compose $(COMPOSE_FILES) up --no-deps --no-build --abort-on-container-exit --exit-code-from app app
.PHONY: test

## Run the container in foreground
start:
	echo "Running container..."
	docker-compose $(COMPOSE_FILES) up --no-deps --no-build --abort-on-container-exit --exit-code-from app app
.PHONY: start

## Start required services
deploy: infos compose-up
.PHONY: up

## Stop all services
undeploy: compose-down-force
.PHONY: down

## Show services logs
logs: compose-logs
.PHONY: logs

## Install as a service (needs root privileges)
install: build
	echo "Install generated files at deployment location..."
	mkdir -p $(DEPLOY_DIR)
	docker run --rm -v $(DEPLOY_DIR):/usr/src/app/build $(USERNAME)/$(APPNAME) run build
.PHONY: install

