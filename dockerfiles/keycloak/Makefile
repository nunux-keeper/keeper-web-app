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

# Include common Make tasks
root_dir:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
makefiles:=$(root_dir)/../../makefiles
include $(makefiles)/help.Makefile
include $(makefiles)/docker.Makefile

