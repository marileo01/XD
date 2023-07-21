FROM node:18-alpine3.18
RUN apk update && apk add git

WORKDIR /app
COPY . .
RUN npm install

ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]
