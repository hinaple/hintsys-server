FROM node:21-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
CMD [ "npm", "start" ]
RUN apk add tzdata