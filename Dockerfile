FROM node:22-bookworm-slim AS build
WORKDIR /app/marketing
COPY marketing/package*.json ./
RUN npm ci
COPY marketing/ ./
ARG BUILD_SCRIPT=build:release
RUN npm run "$BUILD_SCRIPT"

FROM nginx:1.27-alpine
COPY ops/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/marketing/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/
