.SILENT :
.PHONY : up down install

USERNAME:=nunux-keeper
APPNAME:=keeper-web-app
env?=dev

RUN_CUSTOM_FLAGS?=-p 3000:3000

# Docker configuartion regarding the system architecture
BASEIMAGE=node:6-onbuild
UNAME_M:=$(shell uname -m)
ifeq ($(UNAME_M),armv7l)
	ARM_BASEIMAGE=hypriot/rpi-node/6-onbuild
endif

DEPLOY_DIR:=/var/www/html/keeper.nunux.org

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
	$(DOCKER) run --rm -v $(DEPLOY_DIR):$(VOLUME_CONTAINER_PATH)/build $(IMAGE) run build

