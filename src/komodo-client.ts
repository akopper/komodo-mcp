/**
 * Komodo API Client
 * Provides typed methods for interacting with the Komodo Core API
 */

export interface KomodoConfig {
  address: string;
  apiKey: string;
  apiSecret: string;
}

export interface KomodoRequest {
  type: string;
  params: Record<string, unknown>;
}

export class KomodoClient {
  private config: KomodoConfig;

  constructor(config: KomodoConfig) {
    this.config = config;
  }

  /**
   * Create client from environment variables
   */
  static fromEnv(): KomodoClient {
    const address = process.env.KOMODO_ADDRESS;
    const apiKey = process.env.KOMODO_API_KEY;
    const apiSecret = process.env.KOMODO_API_SECRET;

    if (!address || !apiKey || !apiSecret) {
      throw new Error(
        "Missing required environment variables: KOMODO_ADDRESS, KOMODO_API_KEY, KOMODO_API_SECRET"
      );
    }

    return new KomodoClient({ address, apiKey, apiSecret });
  }

  /**
   * Make a request to the Komodo API
   */
  private async request<T>(
    endpoint: "read" | "write" | "execute",
    body: KomodoRequest
  ): Promise<T> {
    const url = `${this.config.address}/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.config.apiKey,
        "X-Api-Secret": this.config.apiSecret,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Komodo API error (${response.status}): ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // ============ READ OPERATIONS ============

  async listServers(): Promise<unknown> {
    return this.request("read", { type: "ListServers", params: {} });
  }

  async listStacks(): Promise<unknown> {
    return this.request("read", { type: "ListStacks", params: {} });
  }

  async listDeployments(): Promise<unknown> {
    return this.request("read", { type: "ListDeployments", params: {} });
  }

  async getStack(stack: string): Promise<unknown> {
    return this.request("read", { type: "GetStack", params: { stack } });
  }

  async getStackLog(stack: string): Promise<unknown> {
    return this.request("read", { type: "GetStackLog", params: { stack } });
  }

  async getContainerLog(
    server: string,
    container: string,
    tail?: number
  ): Promise<unknown> {
    return this.request("read", {
      type: "GetContainerLog",
      params: { server, container, tail: tail ?? 100 },
    });
  }

  async listDockerContainers(server: string): Promise<unknown> {
    return this.request("read", {
      type: "ListDockerContainers",
      params: { server },
    });
  }

  async inspectDockerContainer(
    server: string,
    container: string
  ): Promise<unknown> {
    return this.request("read", {
      type: "InspectDockerContainer",
      params: { server, container },
    });
  }

  async getSystemStats(server: string): Promise<unknown> {
    return this.request("read", { type: "GetSystemStats", params: { server } });
  }

  async listDockerImages(server: string): Promise<unknown> {
    return this.request("read", {
      type: "ListDockerImages",
      params: { server },
    });
  }

  async listDockerNetworks(server: string): Promise<unknown> {
    return this.request("read", {
      type: "ListDockerNetworks",
      params: { server },
    });
  }

  async listDockerVolumes(server: string): Promise<unknown> {
    return this.request("read", {
      type: "ListDockerVolumes",
      params: { server },
    });
  }

  async listAlerts(): Promise<unknown> {
    return this.request("read", { type: "ListAlerts", params: {} });
  }

  async searchContainerLog(
    server: string,
    container: string,
    terms: string[]
  ): Promise<unknown> {
    return this.request("read", {
      type: "SearchContainerLog",
      params: { server, container, terms },
    });
  }

  async getStacksSummary(): Promise<unknown> {
    return this.request("read", { type: "GetStacksSummary", params: {} });
  }

  // ============ EXECUTE OPERATIONS ============

  async deployStack(stack: string): Promise<unknown> {
    return this.request("execute", { type: "DeployStack", params: { stack } });
  }

  async startStack(stack: string): Promise<unknown> {
    return this.request("execute", { type: "StartStack", params: { stack } });
  }

  async stopStack(stack: string): Promise<unknown> {
    return this.request("execute", { type: "StopStack", params: { stack } });
  }

  async restartStack(stack: string): Promise<unknown> {
    return this.request("execute", { type: "RestartStack", params: { stack } });
  }

  async destroyStack(stack: string): Promise<unknown> {
    return this.request("execute", { type: "DestroyStack", params: { stack } });
  }

  async pullStackImages(stack: string): Promise<unknown> {
    return this.request("execute", {
      type: "PullStackImages",
      params: { stack },
    });
  }

  async startContainer(server: string, container: string): Promise<unknown> {
    return this.request("execute", {
      type: "StartContainer",
      params: { server, container },
    });
  }

  async stopContainer(server: string, container: string): Promise<unknown> {
    return this.request("execute", {
      type: "StopContainer",
      params: { server, container },
    });
  }

  async restartContainer(server: string, container: string): Promise<unknown> {
    return this.request("execute", {
      type: "RestartContainer",
      params: { server, container },
    });
  }

  async pruneDockerImages(server: string): Promise<unknown> {
    return this.request("execute", {
      type: "PruneDockerImages",
      params: { server },
    });
  }

  async pruneDockerNetworks(server: string): Promise<unknown> {
    return this.request("execute", {
      type: "PruneDockerNetworks",
      params: { server },
    });
  }

  async pruneDockerSystem(server: string): Promise<unknown> {
    return this.request("execute", {
      type: "PruneDockerSystem",
      params: { server },
    });
  }

  // ============ WRITE OPERATIONS ============

  async createStack(
    name: string,
    serverId: string,
    composeContents?: string
  ): Promise<unknown> {
    return this.request("write", {
      type: "CreateStack",
      params: {
        name,
        config: {
          server_id: serverId,
          file_contents: composeContents ?? "",
        },
      },
    });
  }

  async updateStack(id: string, config: Record<string, unknown>): Promise<unknown> {
    return this.request("write", {
      type: "UpdateStack",
      params: { id, config },
    });
  }

  async deleteStack(id: string): Promise<unknown> {
    return this.request("write", { type: "DeleteStack", params: { id } });
  }

  async writeStackFileContents(
    stack: string,
    contents: string
  ): Promise<unknown> {
    return this.request("write", {
      type: "WriteStackFileContents",
      params: { stack, contents },
    });
  }

  async createServer(name: string, address: string): Promise<unknown> {
    return this.request("write", {
      type: "CreateServer",
      params: { name, config: { address } },
    });
  }

  async updateServer(id: string, config: Record<string, unknown>): Promise<unknown> {
    return this.request("write", {
      type: "UpdateServer",
      params: { id, config },
    });
  }

  async deleteServer(id: string): Promise<unknown> {
    return this.request("write", { type: "DeleteServer", params: { id } });
  }

  async renameStack(id: string, name: string): Promise<unknown> {
    return this.request("write", {
      type: "RenameStack",
      params: { id, name },
    });
  }
}
