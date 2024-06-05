FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
RUN npm run db:seeder
CMD ["npm", "run", "dev", "--host", "0.0.0.0", "--port", "8000"]
