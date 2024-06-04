FROM node:18
WORKDIR /back-app
COPY package*.json /back-app/
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
