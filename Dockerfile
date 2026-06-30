FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js seed.js ./
COPY public ./public/

RUN mkdir -p /app/data/uploads

# Inside the container we bind to all interfaces; the published port mapping
# in docker-compose.yml is what restricts access to the host.
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
