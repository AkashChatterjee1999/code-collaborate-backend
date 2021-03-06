FROM ubuntu:18.04 as baseImage

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apt update
RUN apt install -y curl

#Installing node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN /bin/sh nodesource_setup.sh
RUN apt install -y nodejs
RUN node -v

COPY ./ ./
RUN npm install -g yarn
RUN yarn

CMD node app/server.js