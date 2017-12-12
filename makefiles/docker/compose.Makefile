.SILENT :

# Docker compose configuration files
COMPOSE_FILES?=-f docker-compose.yml

# Wait until a service ($$service) is up and running (needs health run flag)
compose-wait:
	sid=`docker-compose $(COMPOSE_FILES) ps -q $(service)`;\
	n=30;\
	while [ $${n} -gt 0 ] ; do\
		status=`docker inspect --format "{{json .State.Health.Status }}" $${sid}`;\
		if [ -z $${status} ]; then echo "No status informations."; exit 1; fi;\
		echo "Waiting for $(service) up and ready ($${status})...";\
		if [ "\"healthy\"" = $${status} ]; then exit 0; fi;\
		sleep 2;\
		n=`expr $$n - 1`;\
	done;\
	echo "Timeout" && exit 1
.PHONY: compose-wait

# Build services (or single service with $$service)
compose-build:
	echo "Building services ..."
	docker-compose $(COMPOSE_FILES) build $(service)
.PHONY: compose-build

# Config a service ($$service)
compose-config: compose-wait
	echo "Configuring $(service)..."
	$(MAKE) config-$(service)
.PHONY: compose-config

# Deploy compose stack
compose-up:
	echo "Deploying compose stack..."
	-cat .env
	docker-compose $(COMPOSE_FILES) up -d
	echo "Congrats! Compose stack deployed."
.PHONY: compose-up

# Un-deploy compose stack
compose-down:
	echo "Un-deploying compose stack..."
	@while [ -z "$$CONTINUE" ]; do \
		read -r -p "Are you sure? [y/N]: " CONTINUE; \
	done ; \
	[ $$CONTINUE = "y" ] || [ $$CONTINUE = "Y" ] || (echo "Exiting."; exit 1;)
	docker-compose $(COMPOSE_FILES) down
	echo "Compose stack un-deployed."
.PHONY: compose-down

# Un-deploy compose stack (without user confirmation)
compose-down-force:
	echo "Un-deploying compose stack..."
	docker-compose $(COMPOSE_FILES) down --remove-orphans
	echo "Compose stack un-deployed."
.PHONY: compose-down-force

# Stop a service ($$service)
compose-stop:
	echo "Stoping service: $(service) ..."
	docker-compose $(COMPOSE_FILES) stop $(service)
.PHONY: compose-stop

# Stop a service ($$service)
compose-start:
	echo "Starting service: $(service) ..."
	docker-compose $(COMPOSE_FILES) up -d $(service)
.PHONY: compose-start

# Restart a service ($$service)
compose-restart:
	echo "Restarting service: $(service) ..."
	docker-compose $(COMPOSE_FILES) restart $(service)
.PHONY: compose-restart

# View service logs ($$service)
compose-logs:
	echo "Viewing $(service) service logs ..."
	docker-compose $(COMPOSE_FILES) logs -f $(service)
.PHONY: compose-logs

# View services status
compose-ps:
	echo "Viewing services status ..."
	docker-compose $(COMPOSE_FILES) ps
.PHONY: compose-ps

