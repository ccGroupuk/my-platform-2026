# Deploy Trigger: 2026-02-08 10:45
FROM n8nio/n8n:latest

USER root
# Install curl for internal diagnostics
# Install curl removed to fix build on minimal image
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n

# Persistence - PostgreSQL
ENV DB_TYPE=postgresdb
ENV DB_POSTGRESDB_DATABASE=railway
ENV DB_POSTGRESDB_HOST=crossover.proxy.rlwy.net
ENV DB_POSTGRESDB_PORT=27364
ENV DB_POSTGRESDB_USER=postgres
ENV DB_POSTGRESDB_PASSWORD=hzjLiwPxNeEnLXdwuCMTpcPZdQIOMCPQ
ENV N8N_ENCRYPTION_KEY=architect-stability-2026

# Routing & Proxy
# Routing & Proxy
ENV WEBHOOK_URL=https://my-platform-2026-production.up.railway.app
# N8N_EDITOR_BASE_URL must be removed
ENV N8N_HOST=0.0.0.0
# ENV N8N_TRUST_PROXY=true

USER node
