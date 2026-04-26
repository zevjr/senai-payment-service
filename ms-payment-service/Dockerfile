FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --ignore-scripts

RUN NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
