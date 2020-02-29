FROM node:latest
COPY . /app
WORKDIR /app
ARG JWT_SECRET="CHANGE_IT"
ENV JWT_SECRET=${JWT_SECRET}
ENV NODE_ENV="production"
RUN npm i
RUN npm run build
CMD npm run server:start