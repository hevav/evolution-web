# Evolution-web

- Official server: https://evo2.herokuapp.com
- hevav's server: https://evolution-hevav.herokuapp.com
- FAQ: [FAQ (ru)](faq-ru.md)


##Basic Install
### Docker
1. Install Docker
1. Build Docker image
    - ``$ docker build . -t evolution-web --build-arg JWT_SECRET="YOUR_JWT_KEY"``
1. Run Docker image
    - ``$ docker run evolution-web --env JWT_SECRET="YOUR_JWT_KEY"``
    
### Heroku
1. Install heroku-cli and Docker
1. Login to your account
    - ``$ heroku login``
    - ``$ docker login --username=_ --password=$(heroku auth:token) registry.heroku.com``
1. Build Docker image
    - ``$ docker build . -t evolution-web --build-arg JWT_SECRET="YOUR_JWT_KEY"``
1. Push evo2 to Heroku
    - ``$ docker push registry.heroku.com/your_heroku_url/evo2``
1. Run evo2
    - ``$ heroku container:release evo2 -a your_heroku_url`` 

### Manual Install
#### Download
1. Clone repo
    - ``$ git clone https://github.com/hevav/evolution-web``
1. Install dependencies
    - ``$ npm i``

#### Run

1. Make .env file
    - ```$ cp .env.sample .env```
1. Fill .env

##### dev:
```
$ npm start
```

##### prod:
```
$ NODE_ENV=production
$ npm run build
$ npm run server:start
```

##### test:
```
$ LOG_LEVEL=warn npm run test:shared
$ LOG_LEVEL=warn npm run test:shared:once
```
##Other envs
Name | Value | Required / Default
---- | ----- | --------
PORT | Port for development server | Default 3000
NODE_ENV | production/test/development | test
LOG_LEVEL | Logging level ('silly', 'debug', 'verbose', 'info', 'warn', 'error') | verbose
JWT_SECRET | JWT Key(any string) | Yes
MONGO_URL | MongoDB URL(mongodb://) for statistics | For statistics
DEBUG_STATE | Any value | For /timeout and /stats
WRITE_STATS | Write stats to MongoDB | Default true
GOOGLE_LOG_CHAT | Write chats to Google docs | Default false
GOOGLE_CLIENT_ID | Google API | For chat logging
GOOGLE_CLIENT_SECRET | Google API | For chat logging
GOOGLE_REFRESH_TOKEN | Google API | For chat logging
GOOGLE_LOGS_FILE | File to write logs | For chat logging
VK_API_ID | VK API | For VK OAuth
VK_API_SECRET | VK API | For VK OAuth
TWITTER_KEY | Twitter API | For Twitter OAuth(soon)
TWITTER_SECRET | Twitter API | For Twitter OAuth(soon)