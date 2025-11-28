# Architecture

This document describes the system architecture and design of the Komodo MCP Server.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Client                                │
│                 (Claude, AI Assistant, etc.)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ MCP Protocol
                          │ (stdio or SSE)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Komodo MCP Server                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Transport Layer                         │   │
│  │              (StdioTransport / SSETransport)              │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                      McpServer                            │   │
│  │                  (Tool Registration)                      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                    Tool Handlers                          │   │
│  │  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐        │   │
│  │  │ Read Tools  │ │Execute Tools │ │ Write Tools │        │   │
│  │  │  (15 tools) │ │  (12 tools)  │ │  (8 tools)  │        │   │
│  │  └─────────────┘ └──────────────┘ └─────────────┘        │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                   KomodoClient                            │   │
│  │            (API Communication Layer)                      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              │ HTTP POST
                              │ (X-Api-Key, X-Api-Secret)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Komodo Core API                             │
│                                                                  │
│  POST /read     - ListStacks, GetContainerLog, etc.             │
│  POST /execute  - DeployStack, StartContainer, etc.             │
│  POST /write    - CreateStack, UpdateServer, etc.               │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

1. **MCP Client** sends a tool call request via the MCP protocol
2. **Transport Layer** receives the request (stdio for local, SSE for network)
3. **McpServer** routes the request to the appropriate tool handler
4. **Tool Handler** validates input with Zod schemas and calls KomodoClient
5. **KomodoClient** makes authenticated HTTP POST request to Komodo Core API
6. Response flows back through the same path

## File Structure

```
src/
├── index.ts           # Entry point - transport setup, Express server (SSE)
├── server.ts          # MCP server factory - creates McpServer, registers tools
├── komodo-client.ts   # Komodo API client - HTTP calls with auth headers
└── tools/
    ├── read.ts        # Read operation tools (15 tools)
    ├── execute.ts     # Execute operation tools (12 tools)
    └── write.ts       # Write operation tools (8 tools)
```

## Component Responsibilities

### index.ts (Entry Point)

- Parses environment variables (`MCP_PORT`, `MCP_TRANSPORT`)
- Initializes appropriate transport (stdio or SSE)
- For SSE mode:
  - Creates Express server
  - Manages `/sse` endpoint for SSE connections
  - Manages `/messages` endpoint for client-to-server messages
  - Provides `/health` endpoint for monitoring
  - Tracks active sessions

### server.ts (Server Factory)

- Creates `KomodoClient` from environment variables
- Creates `McpServer` instance with name and version
- Registers all tools from the three tool modules
- Returns configured server and client instances

### komodo-client.ts (API Client)

- Handles authentication with `X-Api-Key` and `X-Api-Secret` headers
- Provides typed methods for all Komodo API operations
- Routes requests to appropriate endpoint (`/read`, `/execute`, `/write`)
- Handles error responses from Komodo API

### tools/read.ts (Read Operations)

15 tools for querying data:
- Server listing and status
- Stack details and logs
- Container inspection and logs
- Docker resources (images, networks, volumes)
- System statistics and alerts

### tools/execute.ts (Execute Operations)

12 tools for runtime operations:
- Stack lifecycle (deploy, start, stop, restart, destroy)
- Container management (start, stop, restart)
- Docker cleanup (prune images, networks, system)

### tools/write.ts (Write Operations)

8 tools for configuration changes:
- Stack CRUD operations
- Server CRUD operations
- Compose file management

## Transport Modes

### stdio Transport

- Used for local/direct integration
- Single client connection
- Synchronous communication
- Set `MCP_TRANSPORT=stdio`

### SSE Transport (Default)

- Used for Docker/network deployments
- Multiple concurrent clients
- Session management with unique IDs
- Endpoints:
  - `GET /sse` - Establish SSE connection
  - `POST /messages?sessionId=X` - Send messages
  - `GET /health` - Health check

## Authentication

All requests to Komodo Core API include:

```http
POST /read HTTP/1.1
Content-Type: application/json
X-Api-Key: <KOMODO_API_KEY>
X-Api-Secret: <KOMODO_API_SECRET>

{"type": "ListStacks", "params": {}}
```

## Error Handling

1. **Validation Errors**: Zod schemas reject invalid inputs before API calls
2. **API Errors**: KomodoClient throws errors with status code and message
3. **Transport Errors**: Logged to console, appropriate HTTP status returned
