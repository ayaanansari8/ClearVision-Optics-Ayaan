FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_BASEURL=http://localhost:8080
ENV REACT_APP_BASEURL=$REACT_APP_BASEURL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]