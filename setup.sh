docker volume create grafana-volume
docker volume create influxdb-volume
docker volume create log-volume
cp ./hooks/* ./.git/hooks/
chmod +x .git/hooks/pre-commit
