FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

ENV DB_STRING=mongodb+srv://admin:admin@project-a.cedzn.mongodb.net/pathokun?retryWrites=true&w=majority

ENV SECRET_KEY=helloworld

COPY . .

CMD ["npm", "start"]
