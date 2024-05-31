FROM node
WORKDIR /testing
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD [ "npm", "start" ]