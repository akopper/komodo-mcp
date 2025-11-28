# Komodo MCP Server Documentation

An MCP (Model Context Protocol) server providing AI assistants with full access to the Komodo Docker/container management API.

## Quick Navigation

| Document | Description |
|----------|-------------|
| [Architecture](ARCHITECTURE.md) | System design, components, and request flow |
| [API Reference](API.md) | Complete reference for all 35 MCP tools |
| [Development Guide](DEVELOPMENT.md) | Setting up development environment |
| [Deployment Guide](DEPLOYMENT.md) | Production deployment and configuration |

## Overview

Komodo MCP Server enables AI assistants (like Claude) to manage Docker containers, stacks, and servers through the Komodo Core API. It provides 35 tools organized into three categories:

- **Read Operations (15 tools)**: Query servers, stacks, containers, logs, and system stats
- **Execute Operations (12 tools)**: Deploy, start, stop, restart stacks and containers
- **Write Operations (8 tools)**: Create, update, and delete stacks and servers

## Quick Start

### Using npx (recommended)

```bash
export KOMODO_ADDRESS="http://your-komodo-host:9120"
export KOMODO_API_KEY="your-api-key"
export KOMODO_API_SECRET="your-api-secret"
export MCP_TRANSPORT="stdio"

npx komodo-mcp
```

### Using Docker

```bash
docker run -d \
  -p 3113:3113 \
  -e KOMODO_ADDRESS="http://your-komodo-host:9120" \
  -e KOMODO_API_KEY="your-api-key" \
  -e KOMODO_API_SECRET="your-api-secret" \
  komodo-mcp
```

## Features

- Full Komodo API coverage (35 tools)
- Dual transport support (stdio and SSE)
- TypeScript with strict type checking
- Zod schema validation for all inputs
- Docker-ready with health checks
- Runs as non-root user in containers

## Requirements

- Node.js 18.0.0 or higher
- Komodo Core API access with API key/secret
- Network connectivity to Komodo server

## License

MIT License - see [LICENSE](../LICENSE) for details.
