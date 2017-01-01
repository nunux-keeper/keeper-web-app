# Nunux Keeper web app.
#
# VERSION 2.0

FROM node:6-onbuild

MAINTAINER Nicolas Carlier <https://github.com/ncarlier>

# Ports
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["start"]
