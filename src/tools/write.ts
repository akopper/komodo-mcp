/**
 * Write operation tools for Komodo MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KomodoClient } from "../komodo-client.js";

export function registerWriteTools(server: McpServer, client: KomodoClient): void {
  // Create stack
  server.tool(
    "komodo_create_stack",
    "Create a new stack in Komodo",
    {
      name: z.string().describe("Name for the new stack"),
      server_id: z.string().describe("Server ID to deploy the stack on"),
      compose_contents: z.string().optional().describe("Docker Compose file contents (YAML)"),
    },
    async ({ name, server_id, compose_contents }) => {
      const result = await client.createStack(name, server_id, compose_contents);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Update stack
  server.tool(
    "komodo_update_stack",
    "Update stack configuration",
    {
      id: z.string().describe("Stack ID to update"),
      config: z.record(z.unknown()).describe("Configuration object to update"),
    },
    async ({ id, config }) => {
      const result = await client.updateStack(id, config);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Delete stack
  server.tool(
    "komodo_delete_stack",
    "Delete a stack from Komodo. WARNING: This permanently removes the stack configuration!",
    {
      id: z.string().describe("Stack ID to delete"),
    },
    async ({ id }) => {
      const result = await client.deleteStack(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Write stack file contents
  server.tool(
    "komodo_write_stack_contents",
    "Write or update the Docker Compose file contents for a stack",
    {
      stack: z.string().describe("Stack name or ID"),
      contents: z.string().describe("Docker Compose file contents (YAML)"),
    },
    async ({ stack, contents }) => {
      const result = await client.writeStackFileContents(stack, contents);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Create server
  server.tool(
    "komodo_create_server",
    "Add a new server to Komodo",
    {
      name: z.string().describe("Name for the new server"),
      address: z.string().describe("Periphery address (e.g., https://periphery:8120)"),
    },
    async ({ name, address }) => {
      const result = await client.createServer(name, address);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Update server
  server.tool(
    "komodo_update_server",
    "Update server configuration",
    {
      id: z.string().describe("Server ID to update"),
      config: z.record(z.unknown()).describe("Configuration object to update"),
    },
    async ({ id, config }) => {
      const result = await client.updateServer(id, config);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Delete server
  server.tool(
    "komodo_delete_server",
    "Remove a server from Komodo. WARNING: This removes the server connection!",
    {
      id: z.string().describe("Server ID to delete"),
    },
    async ({ id }) => {
      const result = await client.deleteServer(id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Rename stack
  server.tool(
    "komodo_rename_stack",
    "Rename a stack",
    {
      id: z.string().describe("Stack ID to rename"),
      name: z.string().describe("New name for the stack"),
    },
    async ({ id, name }) => {
      const result = await client.renameStack(id, name);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
