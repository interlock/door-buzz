FROM node:6.3.1
RUN mkdir /src
WORKDIR /src
ADD . /src

RUN npm install
RUN npm run postinstall
RUN npm prune --production

EXPOSE 3000
CMD npm start
