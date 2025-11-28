# Deployment Guide

Production deployment and configuration guide for Komodo MCP Server.

## Deployment Options

| Method | Transport | Use Case |
|--------|-----------|----------|
| npm/npx | stdio | Local CLI usage, direct integration |
| Docker | SSE | Containerized deployments, network access |
| Docker Compose | SSE | Multi-container setups |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `KOMODO_ADDRESS` | Yes | - | Komodo Core API URL (e.g., `http://komodo:9120`) |
| `KOMODO_API_KEY` | Yes | - | API key from Komodo Settings |
| `KOMODO_API_SECRET` | Yes | - | API secret from Komodo Settings |
| `MCP_PORT` | No | `3113` | Port for SSE server |
| `MCP_TRANSPORT` | No | `sse` | Transport mode: `sse` or `stdio` |

## Getting Komodo API Credentials

1. Log into your Komodo instance
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the API Key and Secret
5. Save them securely - the secret is only shown once

## Deployment Methods

### Method 1: npx (Direct Usage)

Best for local testing and CLI integration.

```bash
export KOMODO_ADDRESS="http://your-komodo-host:9120"
export KOMODO_API_KEY="your-api-key"
export KOMODO_API_SECRET="your-api-secret"
export MCP_TRANSPORT="stdio"

npx komodo-mcp
```

### Method 2: Docker

Best for containerized deployments.

```bash
docker run -d \
  --name komodo-mcp \
  --restart unless-stopped \
  -p 3113:3113 \
  -e KOMODO_ADDRESS="http://your-komodo-host:9120" \
  -e KOMODO_API_KEY="your-api-key" \
  -e KOMODO_API_SECRET="your-api-secret" \
  komodo-mcp
```

### Method 3: Docker Compose

Best for multi-container setups.

```yaml
version: "3.8"
services:
  komodo-mcp:
    image: komodo-mcp
    build: .
    restart: unless-stopped
    ports:
      - "3113:3113"
    environment:
      - KOMODO_ADDRESS=${KOMODO_ADDRESS:-http://host.docker.internal:9120}
      - KOMODO_API_KEY=${KOMODO_API_KEY}
      - KOMODO_API_SECRET=${KOMODO_API_SECRET}
      - MCP_PORT=3113
      - MCP_TRANSPORT=sse
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3113/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

Start with:

```bash
docker compose up -d
```

## Transport Modes

### stdio Transport

- **Use when:** Running locally, integrating with MCP-aware applications
- **Set:** `MCP_TRANSPORT=stdio`
- **Communication:** Through stdin/stdout
- **Connections:** Single client

### SSE Transport (Default)

- **Use when:** Running in Docker, network access required
- **Set:** `MCP_TRANSPORT=sse` (or omit, it's the default)
- **Communication:** HTTP with Server-Sent Events
- **Connections:** Multiple concurrent clients
- **Endpoints:**
  - `GET /sse` - Establish SSE connection
  - `POST /messages?sessionId=X` - Send messages
  - `GET /health` - Health check

## Network Configuration

### Docker Network Access

When Komodo runs on the host machine, use `host.docker.internal`:

```yaml
environment:
  - KOMODO_ADDRESS=http://host.docker.internal:9120
extra_hosts:
  - "host.docker.internal:host-gateway"
```

### Same Docker Network

When both services are in the same Docker network:

```yaml
environment:
  - KOMODO_ADDRESS=http://komodo-core:9120
networks:
  - komodo-network
```

## Security Considerations

### API Credentials

- **Never commit credentials** to version control
- Use environment variables or Docker secrets
- Rotate API keys periodically
- Use least-privilege API keys when possible

### Network Security

- **SSE endpoint binds to 0.0.0.0** - accessible from all interfaces
- Use a reverse proxy (nginx, Traefik) for TLS termination
- Restrict network access with firewall rules
- Consider running in an isolated Docker network

### Reverse Proxy Example (nginx)

```nginx
server {
    listen 443 ssl;
    server_name mcp.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3113;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;

        # SSE specific settings
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

### Reverse Proxy Example (Traefik)

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.komodo-mcp.rule=Host(`mcp.yourdomain.com`)"
  - "traefik.http.routers.komodo-mcp.tls=true"
  - "traefik.http.services.komodo-mcp.loadbalancer.server.port=3113"
```

## Health Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3113/health
```

Response:

```json
{
  "status": "ok",
  "transport": "sse",
  "port": 3113,
  "activeSessions": 2
}
```

### Docker Health Check

The container includes a built-in health check:

```bash
docker inspect --format='{{.State.Health.Status}}' komodo-mcp
```

### Monitoring Active Sessions

The `/health` endpoint reports `activeSessions` count for monitoring concurrent connections.

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs komodo-mcp

# Common issues:
# - Missing environment variables
# - Cannot reach Komodo API
# - Port already in use
```

### Connection Refused

1. Verify Komodo is running: `curl http://your-komodo-host:9120`
2. Check network connectivity from container
3. Verify firewall rules allow the connection

### API Authentication Errors

1. Verify API key and secret are correct
2. Check API key has required permissions
3. Ensure credentials aren't expired

### SSE Connection Drops

1. Check proxy timeout settings (increase if needed)
2. Verify proxy has SSE-compatible configuration
3. Check for network interruptions

## Claude Desktop Integration

Add to your Claude Desktop config (`~/.config/claude/claude_desktop_config.json` on Linux):

```json
{
  "mcpServers": {
    "komodo": {
      "command": "npx",
      "args": ["komodo-mcp"],
      "env": {
        "KOMODO_ADDRESS": "http://your-komodo-host:9120",
        "KOMODO_API_KEY": "your-api-key",
        "KOMODO_API_SECRET": "your-api-secret",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

## Performance Tuning

### Connection Limits

For high-connection scenarios, consider:

- Increasing Node.js memory: `NODE_OPTIONS="--max-old-space-size=512"`
- Using a connection pooling proxy
- Running multiple instances behind a load balancer

### Resource Requirements

- **Memory:** ~50-100MB per instance
- **CPU:** Minimal (mostly I/O bound)
- **Connections:** Limited by system file descriptors
