# Development Guide

Guide for setting up a development environment and contributing to Komodo MCP Server.

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Access to a Komodo Core API instance
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nicolasestrem/komodo-mcp.git
cd komodo-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
KOMODO_ADDRESS=http://your-komodo-host:9120
KOMODO_API_KEY=your-api-key
KOMODO_API_SECRET=your-api-secret
MCP_PORT=3113
MCP_TRANSPORT=sse
```

### 4. Build

```bash
npm run build
```

### 5. Run

```bash
npm start
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Watch mode - auto-rebuild on changes |
| `npm start` | Run the compiled server |
| `npm run clean` | Remove the `dist/` directory |

## Project Structure

```
komodo-mcp/
├── src/
│   ├── index.ts           # Entry point, transport setup
│   ├── server.ts          # MCP server factory
│   ├── komodo-client.ts   # API client
│   └── tools/
│       ├── read.ts        # Read operation tools
│       ├── execute.ts     # Execute operation tools
│       └── write.ts       # Write operation tools
├── dist/                  # Compiled JavaScript (generated)
├── docs/                  # Documentation
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Adding New Tools

To add a new MCP tool:

### 1. Choose the Appropriate File

- `src/tools/read.ts` - For non-mutating queries
- `src/tools/execute.ts` - For runtime operations
- `src/tools/write.ts` - For configuration changes

### 2. Add KomodoClient Method

First, add a method to `src/komodo-client.ts`:

```typescript
async myNewOperation(param1: string, param2: number): Promise<unknown> {
  return this.request("read", {
    type: "MyNewOperation",
    params: { param1, param2 },
  });
}
```

### 3. Register the Tool

Add the tool registration in the appropriate tools file:

```typescript
server.tool(
  "komodo_my_new_tool",                    // Tool name (snake_case)
  "Description of what this tool does",    // Description for AI
  {
    // Zod schema for parameters
    param1: z.string().describe("Description of param1"),
    param2: z.number().optional().describe("Optional param2"),
  },
  async ({ param1, param2 }) => {
    const result = await client.myNewOperation(param1, param2 ?? 0);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);
```

### 4. Document the Tool

Add documentation to `docs/API.md` following the existing format.

## Code Style

### TypeScript Configuration

The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

### Naming Conventions

- **Tool names**: `komodo_snake_case` (e.g., `komodo_list_stacks`)
- **Functions**: `camelCase` (e.g., `listStacks`)
- **Files**: `kebab-case.ts` (e.g., `komodo-client.ts`)
- **Classes**: `PascalCase` (e.g., `KomodoClient`)

### Input Validation

All tool inputs are validated using Zod schemas. Always include `.describe()` for AI context:

```typescript
{
  stack: z.string().describe("Stack name or ID"),
  tail: z.number().optional().describe("Number of lines (default: 100)"),
}
```

## Testing with MCP Inspector

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) for testing:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Testing with curl (SSE mode)

### Establish SSE Connection

```bash
curl -N http://localhost:3113/sse
```

### Send Messages

```bash
curl -X POST "http://localhost:3113/messages?sessionId=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Health Check

```bash
curl http://localhost:3113/health
```

## Debugging

### Enable Verbose Logging

Currently, logs go to stdout/stderr. For SSE mode, connection events are logged automatically.

### Common Issues

1. **"Missing required environment variables"**
   - Ensure `KOMODO_ADDRESS`, `KOMODO_API_KEY`, and `KOMODO_API_SECRET` are set

2. **"Komodo API error (401)"**
   - Check API key and secret are correct
   - Verify the API credentials have appropriate permissions

3. **"Connection refused"**
   - Verify `KOMODO_ADDRESS` is reachable
   - Check if Komodo Core is running

## Building Docker Image

```bash
docker build -t komodo-mcp .
```

Test the image:

```bash
docker run --rm \
  -e KOMODO_ADDRESS="http://host.docker.internal:9120" \
  -e KOMODO_API_KEY="your-key" \
  -e KOMODO_API_SECRET="your-secret" \
  -p 3113:3113 \
  komodo-mcp
```
