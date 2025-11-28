# Komodo MCP Server

An MCP (Model Context Protocol) server that provides AI assistants with full access to [Komodo](https://komo.do) - a powerful Docker/container management and deployment system.

## Features

- **35 tools** covering the full Komodo API
- **Read operations**: List stacks, servers, containers, images, networks, volumes, logs
- **Execute operations**: Deploy, start, stop, restart, destroy stacks and containers
- **Write operations**: Create, update, delete stacks and servers
- **Docker deployment**: Run as a container managed by Komodo itself
- **SSE transport**: Real-time communication with Claude Code and other MCP clients

## Quick Start

### Using Docker (Recommended)

1. Clone this repository:
```bash
git clone https://github.com/nicolasestrem/komodo-mcp.git
cd komodo-mcp
```

2. Create your environment file:
```bash
cp .env.example .env
# Edit .env with your Komodo API credentials
```

3. Build and run:
```bash
docker compose up -d
```

4. Add to your Claude Code `.mcp.json`:
```json
{
  "mcpServers": {
    "komodo": {
      "type": "sse",
      "url": "http://localhost:3113/sse"
    }
  }
}
```

### Using npm

```bash
npm install
npm run build
npm start
```

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `KOMODO_ADDRESS` | Komodo Core API URL | `http://localhost:9120` |
| `KOMODO_API_KEY` | API key from Komodo | Required |
| `KOMODO_API_SECRET` | API secret from Komodo | Required |
| `MCP_PORT` | Port for SSE server | `3113` |

### Getting API Credentials

1. Open your Komodo web UI
2. Go to **Settings** (gear icon)
3. Navigate to **API Keys**
4. Click **Create API Key**
5. Copy both the Key and Secret

## Available Tools

### Read Operations (15 tools)

| Tool | Description |
|------|-------------|
| `komodo_list_servers` | List all connected servers |
| `komodo_list_stacks` | List all stacks with status |
| `komodo_list_deployments` | List all deployments |
| `komodo_get_stack` | Get detailed stack information |
| `komodo_get_stack_log` | Get stack deployment logs |
| `komodo_get_container_log` | Get container logs |
| `komodo_list_containers` | List Docker containers on a server |
| `komodo_inspect_container` | Inspect container details |
| `komodo_get_system_stats` | Get server system statistics |
| `komodo_list_images` | List Docker images |
| `komodo_list_networks` | List Docker networks |
| `komodo_list_volumes` | List Docker volumes |
| `komodo_get_alerts` | List system alerts |
| `komodo_search_logs` | Search container logs |
| `komodo_get_stack_services` | Get stack service status |

### Execute Operations (12 tools)

| Tool | Description |
|------|-------------|
| `komodo_deploy_stack` | Deploy/redeploy a stack |
| `komodo_start_stack` | Start a stopped stack |
| `komodo_stop_stack` | Stop a running stack |
| `komodo_restart_stack` | Restart a stack |
| `komodo_destroy_stack` | Stop and remove a stack |
| `komodo_pull_stack` | Pull latest images for a stack |
| `komodo_start_container` | Start a container |
| `komodo_stop_container` | Stop a container |
| `komodo_restart_container` | Restart a container |
| `komodo_prune_images` | Remove unused images |
| `komodo_prune_networks` | Remove unused networks |
| `komodo_prune_system` | Full Docker system prune |

### Write Operations (8 tools)

| Tool | Description |
|------|-------------|
| `komodo_create_stack` | Create a new stack |
| `komodo_update_stack` | Update stack configuration |
| `komodo_delete_stack` | Delete a stack |
| `komodo_write_stack_contents` | Write/update compose file |
| `komodo_create_server` | Add a new server |
| `komodo_update_server` | Update server configuration |
| `komodo_delete_server` | Remove a server |
| `komodo_rename_stack` | Rename a stack |

## Example Usage

Once connected, you can ask Claude Code things like:

- "List all my Komodo stacks"
- "Show me the logs for the nginx stack"
- "Restart the wordpress stack"
- "What containers are running on my server?"
- "Deploy the staging stack"
- "Show system stats for my server"

## Security Considerations

- **API credentials**: Store in environment variables, never commit `.env` files
- **Network access**: By default, the MCP server listens on all interfaces. In production, consider restricting to localhost or using a reverse proxy
- **Full access**: This server provides full Komodo API access including destructive operations. Use with caution.
- **API key rotation**: Regularly rotate API keys in Komodo UI

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Run the server
npm start
```

## Docker Build

```bash
# Build image
docker build -t komodo-mcp .

# Run with environment variables
docker run -d \
  -e KOMODO_ADDRESS=http://your-komodo:9120 \
  -e KOMODO_API_KEY=your-key \
  -e KOMODO_API_SECRET=your-secret \
  -p 3113:3113 \
  komodo-mcp
```

## Architecture

```
src/
├── index.ts           # Entry point, SSE server setup
├── server.ts          # MCP server configuration
├── komodo-client.ts   # Komodo API client
└── tools/
    ├── read.ts        # Read operation tools
    ├── write.ts       # Write operation tools
    └── execute.ts     # Execute operation tools
```

## API Reference

This MCP server wraps the [Komodo Core API](https://komo.do/docs/api). The API uses a JSON-RPC style interface:

```bash
# Example: List stacks
curl -X POST http://your-komodo:9120/read \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: YOUR_KEY" \
  -H "X-Api-Secret: YOUR_SECRET" \
  -d '{"type": "ListStacks", "params": {}}'
```

## License

MIT License - see [LICENSE](LICENSE) file.

## Links

- [Komodo Documentation](https://komo.do/docs)
- [Komodo GitHub](https://github.com/moghtech/komodo)
- [MCP Protocol](https://modelcontextprotocol.io)
