FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
# RUN npm install
RUN npm ci

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port your app runs on
EXPOSE 4000

# Command to run your application
# CMD ["npm", "run", "start:dev"] 
CMD [ "npm", "run", "start:migrate:dev" ] 
# CMD [  "npm", "run", "start:migrate:prod" ] 

# Command to run application based on NODE_ENV value
# CMD ["sh", "-c", "if [ '$NODE_ENV' = 'development' ]; then npm run start:migrate:dev; else npm run start:migrate:prod; fi"]