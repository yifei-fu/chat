FROM node:8

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install --prefix ./frontend
RUN npm run build --prefix ./frontend

EXPOSE 3000
EXPOSE 8010
CMD [ "npm", "start" ]