/**
 * Read operation tools for Komodo MCP Server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { KomodoClient } from "../komodo-client.js";

export function registerReadTools(server: McpServer, client: KomodoClient): void {
  // List all servers
  server.tool(
    "komodo_list_servers",
    "List all Komodo servers with their status and configuration",
    {},
    async () => {
      const result = await client.listServers();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List all stacks
  server.tool(
    "komodo_list_stacks",
    "List all Komodo stacks with their current state (running/down)",
    {},
    async () => {
      const result = await client.listStacks();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List all deployments
  server.tool(
    "komodo_list_deployments",
    "List all Komodo deployments",
    {},
    async () => {
      const result = await client.listDeployments();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get stack details
  server.tool(
    "komodo_get_stack",
    "Get detailed information about a specific stack",
    {
      stack: z.string().describe("Stack name or ID"),
    },
    async ({ stack }) => {
      const result = await client.getStack(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get stack logs
  server.tool(
    "komodo_get_stack_log",
    "Get deployment logs for a stack",
    {
      stack: z.string().describe("Stack name or ID"),
    },
    async ({ stack }) => {
      const result = await client.getStackLog(stack);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get container logs
  server.tool(
    "komodo_get_container_log",
    "Get logs from a specific container",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID"),
      tail: z.number().optional().describe("Number of lines to return (default: 100)"),
    },
    async ({ server, container, tail }) => {
      const result = await client.getContainerLog(server, container, tail);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List containers on a server
  server.tool(
    "komodo_list_containers",
    "List all Docker containers on a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.listDockerContainers(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Inspect container
  server.tool(
    "komodo_inspect_container",
    "Get detailed information about a container",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID"),
    },
    async ({ server, container }) => {
      const result = await client.inspectDockerContainer(server, container);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get system stats
  server.tool(
    "komodo_get_system_stats",
    "Get system statistics for a server (CPU, memory, disk)",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.getSystemStats(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List Docker images
  server.tool(
    "komodo_list_images",
    "List all Docker images on a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.listDockerImages(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List Docker networks
  server.tool(
    "komodo_list_networks",
    "List all Docker networks on a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.listDockerNetworks(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // List Docker volumes
  server.tool(
    "komodo_list_volumes",
    "List all Docker volumes on a server",
    {
      server: z.string().describe("Server name or ID"),
    },
    async ({ server }) => {
      const result = await client.listDockerVolumes(server);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get alerts
  server.tool(
    "komodo_get_alerts",
    "List all system alerts",
    {},
    async () => {
      const result = await client.listAlerts();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Search container logs
  server.tool(
    "komodo_search_logs",
    "Search container logs for specific terms",
    {
      server: z.string().describe("Server name or ID"),
      container: z.string().describe("Container name or ID"),
      terms: z.array(z.string()).describe("Search terms to find in logs"),
    },
    async ({ server, container, terms }) => {
      const result = await client.searchContainerLog(server, container, terms);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get stacks summary
  server.tool(
    "komodo_get_stack_services",
    "Get summary of all stacks with their services and status",
    {},
    async () => {
      const result = await client.getStacksSummary();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
