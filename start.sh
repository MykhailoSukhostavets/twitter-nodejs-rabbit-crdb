docker-compose build --no-cache
docker-compose up --remove-orphans -d
node client.js &
curl --retry 50 --retry-all-errors \
    'http://localhost:3000/messages'