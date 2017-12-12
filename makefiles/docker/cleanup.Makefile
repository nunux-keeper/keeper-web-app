.SILENT :

# Remove dangling Docker images
cleanup:
	echo "Removing dangling docker images..."
	-docker images -q --filter 'dangling=true' | xargs docker rmi
.PHONY: cleanup

