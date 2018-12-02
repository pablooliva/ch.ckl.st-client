# to be run in Droplet
docker pull pablooliva/ch.ckl.st-client
docker stack rm chcklst-client
docker stack deploy -c /home/docker-compose-prod.yml chcklst-client