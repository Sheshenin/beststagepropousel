#!/usr/bin/env bash
set -e

DOMAIN="sheshenin.com"
EMAIL="admin@sheshenin.com"

apt update
apt -y install ca-certificates curl ufw fail2ban docker-compose-plugin

systemctl enable --now docker

ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

mkdir -p /srv/proxy/letsencrypt
mkdir -p /srv/apps/test

cat >/srv/proxy/docker-compose.yml <<EOF
version: "3.9"
services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: always
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.le.acme.email=${EMAIL}"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.le.acme.httpchallenge=true"
      - "--certificatesresolvers.le.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
EOF

touch /srv/proxy/letsencrypt/acme.json
chmod 600 /srv/proxy/letsencrypt/acme.json

cat >/srv/apps/test/docker-compose.yml <<EOF
version: "3.9"
services:
  whoami:
    image: traefik/whoami
    container_name: test-whoami
    restart: always
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.test.rule=Host(\`test.${DOMAIN}\`)"
      - "traefik.http.routers.test.entrypoints=websecure"
      - "traefik.http.routers.test.tls=true"
      - "traefik.http.routers.test.tls.certresolver=le"
EOF

cd /srv/proxy
docker compose up -d

cd /srv/apps/test
docker compose up -d

echo
echo "Bootstrap finished. Check https://test.${DOMAIN}"
