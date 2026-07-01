FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
# Inside the container we bind to all interfaces; the published port mapping
# in docker-compose.yml is what restricts access to the host.
ENV HOST=0.0.0.0
ENV PORT=3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js seed.js ./
COPY public ./public/

# Data dir must be writable by the non-root 'node' user (uploads + JSON writes).
# An empty named volume inherits this ownership on first mount.
RUN mkdir -p /app/data/uploads && chown -R node:node /app

# Drop root — a compromise of the app (accepts uploads + JSON import) stays
# confined to an unprivileged user.
USER node

EXPOSE 3000

# Liveness probe via busybox wget (bundled in alpine).
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
