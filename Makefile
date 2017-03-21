.SILENT :
.PHONY : up down install deploy

USERNAME:=nunux-keeper
APPNAME:=keeper-web-app
env?=dev

# Default configuration
ENV_FLAGS?=--env-file="./etc/default/$(env).env"

# Define port
PORT?=3000
PORTS_FLAGS=-p $(PORT):3000

# Custom run flags
RUN_CUSTOM_FLAGS?=$(PORTS_FLAGS) $(ENV_FLAGS)

# Docker configuartion regarding the system architecture
BASEIMAGE=node:6-onbuild
ARM_BASEIMAGE=hypriot/rpi-node/6-onbuild

DEPLOY_DIR:=/var/www/html/app.nunux.org/keeper

# Include common Make tasks
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
DOCKERFILES:=$(ROOT_DIR)/dockerfiles
include $(DOCKERFILES)/common/_Makefile

## Start a complete infrastucture
up:
	echo "Starting Keycloak ..."
	make -C $(DOCKERFILES)/keycloak stop rm start

## Stop the infrastucture
down:
	echo "Stoping Keycloak ..."
	make -C $(DOCKERFILES)/keycloak stop rm

## Install builded static files (needs root privileges)
install: build
	echo "Install generated files at deployment location..."
	mkdir -p $(DEPLOY_DIR)
	$(DOCKER) run --rm -v $(DEPLOY_DIR):$(VOLUME_CONTAINER_PATH)/build $(IMAGE) run build

## Deploy application
deploy:
	echo "Deploying application..."
	git push deploy
