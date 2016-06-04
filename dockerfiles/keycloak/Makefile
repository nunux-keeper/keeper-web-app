.SILENT :

USERNAME:=jboss
APPNAME:=keycloak

KEYCLOAK_USER:=admin
KEYCLOAK_PASSWORD:=admin

define RUN_CUSTOM_FLAGS
	-p 8080:8080 \
	-e KEYCLOAK_USER=$(KEYCLOAK_USER) \
	-e KEYCLOAK_PASSWORD=$(KEYCLOAK_PASSWORD)
endef

SHELL_CUSTOM_FLAGS=-P

ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

include $(ROOT_DIR)/../common/_Makefile
