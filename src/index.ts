#!/usr/bin/env node

/**
 * Komodo MCP Server
 *
 * An MCP server that provides full access to the Komodo API
 * for Docker/container management and deployment.
 *
 * Supports both stdio and SSE transports.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import { createServer } from "./server.js";

const PORT = parseInt(process.env.MCP_PORT || "3113", 10);
const TRANSPORT = process.env.MCP_TRANSPORT || "sse";

async function main() {
  const { server } = createServer();

  if (TRANSPORT === "stdio") {
    // Stdio transport for local usage
    console.error("Starting Komodo MCP server with stdio transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Komodo MCP server running on stdio");
  } else {
    // SSE transport for Docker/network usage
    const app = express();
    app.use(express.json());

    // Store active transports by session ID
    const transports: Record<string, SSEServerTransport> = {};

    // SSE endpoint
    app.get("/sse", async (req: Request, res: Response) => {
      console.log("New SSE connection");

      try {
        const transport = new SSEServerTransport("/messages", res);
        const sessionId = transport.sessionId;
        transports[sessionId] = transport;

        // Clean up on disconnect
        transport.onclose = () => {
          console.log(`SSE connection closed for session ${sessionId}`);
          delete transports[sessionId];
        };

        // Connect server to transport
        await server.connect(transport);
        console.log(`Established SSE stream with session ID: ${sessionId}`);
      } catch (error) {
        console.error("Error establishing SSE stream:", error);
        if (!res.headersSent) {
          res.status(500).send("Error establishing SSE stream");
        }
      }
    });

    // Message endpoint for client-to-server communication
    app.post("/messages", async (req: Request, res: Response) => {
      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        console.error("No session ID provided in request URL");
        res.status(400).json({ error: "Missing sessionId parameter" });
        return;
      }

      const transport = transports[sessionId];
      if (!transport) {
        console.error(`No active transport for session: ${sessionId}`);
        res.status(404).json({ error: "Session not found" });
        return;
      }

      try {
        await transport.handlePostMessage(req, res, req.body);
      } catch (error) {
        console.error("Error handling message:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error handling request" });
        }
      }
    });

    // Health check endpoint
    app.get("/health", (_req: Request, res: Response) => {
      res.json({ status: "ok", transport: "sse", port: PORT, activeSessions: Object.keys(transports).length });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Komodo MCP server running on http://0.0.0.0:${PORT}`);
      console.log(`SSE endpoint: http://0.0.0.0:${PORT}/sse`);
      console.log(`Health check: http://0.0.0.0:${PORT}/health`);
    });
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
