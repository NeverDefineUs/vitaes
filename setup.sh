docker volume rm mongodb
docker volume create --name=mongodb
docker-compose up -d mongo
docker-compose exec mongo mongorestore --archive=mbckp/base.archive --username root --password vitaes
docker-compose down
