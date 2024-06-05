#!/bin/bash
docker-compose down
docker-compose build
docker-compose up -d

# Ждем некоторое время для инициализации сервисов
sleep 10

# Запускаем init.sh для инициализации данных внутри контейнера приложения
docker exec -it $(docker ps -q -f "name=app") /bin/bash -c "./init.sh"
