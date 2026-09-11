# Pinned by digest, not by tag: node:20-alpine is republished continuously, so a
# tag-only FROM means two builds of the same commit can differ. This digest is
# the multi-arch index, so amd64 and arm64 both still resolve.
# Refresh with: docker buildx imagetools inspect node:20-alpine
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293

WORKDIR /app

ENV NODE_ENV=production
# Inside the container we bind to all interfaces; the published port mapping
# in docker-compose.yml is what restricts access to the host.
ENV HOST=0.0.0.0
ENV PORT=3000
# DATA_DIR is where every JSON store and the uploads folder live; it is the one
# path that must be a volume. Kept explicit so the chown below and the server
# agree on where it is.
ENV DATA_DIR=/app/data

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
