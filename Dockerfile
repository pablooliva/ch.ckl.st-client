FROM node
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 4200
CMD ["npm", "start"]