FROM node
WORKDIR /testing
COPY . .
EXPOSE 5000
RUN npm install
RUN npm run build
CMD [ "npm", "start" ]