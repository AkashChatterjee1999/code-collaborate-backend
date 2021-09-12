FROM ubuntu:18.04 as base-image

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apt update
RUN apt install -y wget curl

#Installing node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
RUN /bin/sh nodesource_setup.sh
RUN apt install -y nodejs
RUN node -v

#Installing docker
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN sudo sh get-docker.sh

#Installing docker-compose
RUN sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN sudo chmod +x /usr/local/bin/docker-compose

COPY ./ ./
RUN npm install -g yarn
RUN yarn

CMD start-socketProxy.sh