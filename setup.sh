docker volume rm mongodb
docker volume create --name=mongodb
docker-compose up -d mongo
sleep 20
docker-compose exec mongo mongorestore --archive=mbckp/base.archive --username root --password vitaes
sleep 2
docker-compose down
cp ./hooks/* ./.git/hooks/
chmod +x .git/hooks/pre-commit
