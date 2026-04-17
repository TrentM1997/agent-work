import { McpTransportClient } from "./mcpTransportClient";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";

export class McpClientManager {
  private server: ChildProcessWithoutNullStreams | null = null;
  private client: McpTransportClient | null = null;
  private clientPromise: Promise<McpTransportClient> | null = null;

  async getClient(): Promise<McpTransportClient> {
    if (this.client) return this.client;
    if (this.clientPromise) return this.clientPromise;

    this.clientPromise = this.createClient().catch((error) => {
      this.reset();
      throw error;
    });

    return this.clientPromise;
  }

  private async createClient(): Promise<McpTransportClient> {
    this.server = this.startServer();
    const client = new McpTransportClient(this.server);

    this.server.on("exit", () => {
      this.reset();
    });

    await client.initialize();
    this.client = client;
    return client;
  }

  private startServer() {
    return spawn("npx", ["tsx", "./server/server.ts"], { shell: true });
  }

  private reset() {
    this.server = null;
    this.client = null;
    this.clientPromise = null;
  }
}
