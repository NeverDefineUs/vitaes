docker volume rm mongodb
docker volume create --name=mongodb
docker volume create grafana-volume
docker volume create influxdb-volume
docker volume create log-volume
docker volume create webapp-volume
docker-compose up -d mongo
sleep 20
docker-compose exec mongo mongorestore --archive=mbckp/base.archive --username root --password vitaes
sleep 2
docker-compose down
