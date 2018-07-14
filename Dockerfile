FROM node:9.9.0
WORKDIR /app
COPY . /app
RUN npm install
RUN npm link @angular/cli
EXPOSE 4200
CMD ["npm", "start"]