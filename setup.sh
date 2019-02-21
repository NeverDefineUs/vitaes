docker volume create --name=mongodb
docker-compose build
docker-compose exec mongo bash