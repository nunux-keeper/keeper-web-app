.SILENT :
.PHONY : up down install

APPNAME:=keeper-web-app
env?=dev

RUN_CUSTOM_FLAGS?=-p 3000:3000

# Docker configuartion regarding the system architecture
BASEIMAGE=node:5-onbuild
UNAME_M:=$(shell uname -m)
ifeq ($(UNAME_M),armv7l)
	BASEIMAGE=ncarlier/nodejs-arm
endif

DEPLOY_DIR:=/var/www/html/keeper-app.nunux.org

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

include $(ROOT_DIR)/dockerfiles/common/_Makefile

## Start a complete infrastucture
up:
	echo "Starting Keycloak ..."
	make -C $(ROOT_DIR)/dockerfiles/keycloak stop rm start

## Stop the infrastucture
down:
	echo "Stoping Keycloak ..."
	make -C $(ROOT_DIR)/dockerfiles/keycloak stop rm

## Install as a service (needs root privileges)
install: build
	echo "Install generated files at deployment location..."
	mkdir -p $(DEPLOY_DIR)
	$(DOCKER) run --rm -it -v $(DEPLOY_DIR):$(VOLUME_CONTAINER_PATH)/dist $(IMAGE) run deploy:prod

