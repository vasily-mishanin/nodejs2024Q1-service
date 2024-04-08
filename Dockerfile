FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
# RUN npm ci

# Copy the rest of the application code
COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "start:migrate:dev" ] 
# CMD [  "npm", "run", "start:migrate:prod" ] 