# express-rabbitmq

<h3>Docker-compose</h3>

1. docker-compose build
2. docker-compose up -d

<h3>Producer</h3>
url: localhost:3001/api/messages - (POST)

`{
 "routeKey": "example",
 "email": "email@mail.com"
}`

<h3>Consumer</h3>

###### Start consume
url: localhost:3002/api/messages/consume - (GET)


