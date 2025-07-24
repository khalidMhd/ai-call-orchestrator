FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Uncomment if using TypeScript
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
