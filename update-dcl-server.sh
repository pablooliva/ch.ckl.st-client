#!/usr/bin/env bash
# to be run in Droplet
docker pull pablooliva/ch.ckl.st-client
docker stack rm chcklst-client
docker stack deploy -c /root/chcklst/docker-compose-clnt-prod.yml chcklst-client
