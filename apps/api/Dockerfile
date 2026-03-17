# GFM API — Node.js 20 Alpine
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache tini

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Production image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

# Copy deps + source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Non-root user
RUN addgroup -S gfm && adduser -S gfm -G gfm
RUN chown -R gfm:gfm /app
USER gfm

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
