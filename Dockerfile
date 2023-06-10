FROM node:16-alpine3.11
WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "start:prod"]