FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
COPY docker-entrypoint.sh ./

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini wget
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && mkdir -p uploads
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]
