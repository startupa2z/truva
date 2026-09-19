FROM node:22-bookworm-slim AS build
WORKDIR /app/marketing
COPY marketing/package*.json ./
RUN npm ci
COPY marketing/ ./
COPY frontend/ /app/frontend/
RUN npm run build:release

FROM node:22-bookworm-slim
ARG SOURCE_COMMIT=unknown
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80 COMMUNITY_ORIGIN=https://truvasolutions.com COMMUNITY_STATE_DIR=/data TRUST_PROXY=1 RELEASE_COMMIT=$SOURCE_COMMIT
WORKDIR /app/marketing
COPY --from=build /app/marketing/dist ./dist
COPY marketing/server ./server
RUN mkdir -p /data && chown node:node /data
USER node
EXPOSE 80
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:80/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node","server/community.mjs"]
