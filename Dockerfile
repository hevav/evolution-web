FROM node:latest
COPY . /app
WORKDIR /app
ARG JWT_SECRET="CHANGE_IT"
ENV JWT_SECRET=${JWT_SECRET}
ARG VK_API_ID="CHANGE_IT"
ENV VK_API_ID=${VK_API_ID}
ENV NODE_ENV="production"
RUN npm i
RUN npm run build
CMD npm run server:start