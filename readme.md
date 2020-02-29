# Evolution-web

Main server: https://evo2.herokuapp.com

[FAQ (ru)](faq-ru.md)

### Docker
1. Install Docker
1.  ``$ docker build . -t evolution-web --build-arg JWT_SECRET="YOUR_JWT_KEY"``
1.  ``$ docker run evolution-web --env JWT_SECRET="YOUR_JWT_KEY"``

### Install
1. Clone
1. ```$ npm i```
1. ```$ cp .env.sample .env```
1. Fill .env

### Run

#### dev:
```
$ npm start
```

#### prod:
```
$ NODE_ENV=production
$ npm run build
$ npm run server:start
```

#### test:
```
$ LOG_LEVEL=warn npm run test:shared
$ LOG_LEVEL=warn npm run test:shared:once
```
