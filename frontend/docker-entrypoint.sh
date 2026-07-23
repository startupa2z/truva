#!/bin/sh
set -eu

API_BASE="${TRUVA_API_BASE:-}"
cat > /usr/share/nginx/html/assets/config.js <<EOF
window.TRUVA_API_BASE = "${API_BASE}";
EOF

if [ -n "${API_PROXY_BACKEND:-}" ]; then
  cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass ${API_PROXY_BACKEND}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /health {
        proxy_pass ${API_PROXY_BACKEND}/health;
    }

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF
else
  cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF
fi

exec nginx -g "daemon off;"
