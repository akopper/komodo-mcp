/**
 * Execute operation tools for Komodo MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KomodoClient } from "../komodo-client.js";

export function registerExecuteTools(server: McpServer, client: KomodoClient): void {
  // Deploy stack
  server.tool(
    "komodo_deploy_stack",
    "Deploy or redeploy a stack (pulls images and starts containers)",
    {
      stack: z.string().describe("Stack name or ID to deploy"),
    },
    async ({ stack }) => {
      const result = await client.deployStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Start stack
  server.tool(
    "komodo_start_stack",
    "Start a stopped stack",
    {
      stack: z.string().describe("Stack name or ID to start"),
    },
    async ({ stack }) => {
      const result = await client.startStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Stop stack
  server.tool(
    "komodo_stop_stack",
    "Stop a running stack (keeps containers, just stops them)",
    {
      stack: z.string().describe("Stack name or ID to stop"),
    },
    async ({ stack }) => {
      const result = await client.stopStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Restart stack
  server.tool(
    "komodo_restart_stack",
    "Restart a stack (stop then start)",
    {
      stack: z.string().describe("Stack name or ID to restart"),
    },
    async ({ stack }) => {
      const result = await client.restartStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Destroy stack
  server.tool(
    "komodo_destroy_stack",
    "Destroy a stack (stops and removes containers). WARNING: This is destructive!",
    {
      stack: z.string().describe("Stack name or ID to destroy"),
    },
    async ({ stack }) => {
      const result = await client.destroyStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Pull stack images
  server.tool(
    "komodo_pull_stack",
    "Pull latest images for a stack without deploying",
    {
      stack: z.string().describe("Stack name or ID"),
    },
    async ({ stack }) => {
      const result = await client.pullStackImages(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Start container
  server.tool(
    "komodo_start_container",
    "Start a specific container",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID to start"),
    },
    async ({ server, container }) => {
      const result = await client.startContainer(server, container);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Stop container
  server.tool(
    "komodo_stop_container",
    "Stop a specific container",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID to stop"),
    },
    async ({ server, container }) => {
      const result = await client.stopContainer(server, container);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Restart container
  server.tool(
    "komodo_restart_container",
    "Restart a specific container",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID to restart"),
    },
    async ({ server, container }) => {
      const result = await client.restartContainer(server, container);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Prune images
  server.tool(
    "komodo_prune_images",
    "Remove unused Docker images from a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.pruneDockerImages(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Prune networks
  server.tool(
    "komodo_prune_networks",
    "Remove unused Docker networks from a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.pruneDockerNetworks(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Prune system
  server.tool(
    "komodo_prune_system",
    "Full Docker system prune (images, networks, volumes, build cache). WARNING: This is destructive!",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.pruneDockerSystem(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
