#!/usr/bin/env bash
# to be run in Droplet
docker pull pablooliva/ch.ckl.st-client
docker stack rm chcklst-client
docker stack deploy -c /home/chcklst/client/docker-compose-clnt-prod.yml chcklst-client
