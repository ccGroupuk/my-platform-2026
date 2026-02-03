FROM n8nio/n8n:latest

# Switch to root to ensure permissions for dynamic port binding if needed, 
# although n8n user is preferred for security. 
# Railway sets the PORT environment variable.
# We'll use a shell command to map PORT to N8N_PORT at runtime.

USER root

# Install any extra packages if needed, e.g. for MCP
# RUN apk add --no-cache curl

USER node

# Start n8n, mapping Railway's PORT to N8N_PORT
CMD ["sh", "-c", "export N8N_PORT=$PORT && n8n start"]
