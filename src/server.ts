/**
 * MCP Server configuration and setup
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { KomodoClient } from "./komodo-client.js";
import { registerReadTools } from "./tools/read.js";
import { registerExecuteTools } from "./tools/execute.js";
import { registerWriteTools } from "./tools/write.js";

export function createServer(): { server: McpServer; client: KomodoClient } {
  // Create Komodo client from environment
  const client = KomodoClient.fromEnv();

  // Create MCP server
  const server = new McpServer({
    name: "komodo",
    version: "1.0.0",
  });

  // Register all tools
  registerReadTools(server, client);
  registerExecuteTools(server, client);
  registerWriteTools(server, client);

  return { server, client };
}
