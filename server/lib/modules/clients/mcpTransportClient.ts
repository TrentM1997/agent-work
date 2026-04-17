import type { ChildProcessWithoutNullStreams } from "child_process";
import type { JsonRpcResponse } from "@/server/lib/types";
import { McpInitializeResultSchema } from "@/schemas/chatResponseSchema";
import { MCP_PROTOCOL_VERSION } from "../../init/mcpProtocolVersion";

export class McpTransportClient {
  private nextId = 1;
  private buffer = "";
  private pending = new Map<
    number,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
    }
  >();
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(private readonly server: ChildProcessWithoutNullStreams) {
    this.setupServerListeners();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const rawResult = await this.sendMcpRequest({
        jsonrpc: "2.0",
        id: this.nextRequestId(),
        method: "initialize",
        params: {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: {},
          clientInfo: {
            name: "weather-web-app",
            version: "0.1.0",
          },
        },
      });

      McpInitializeResultSchema.parse(rawResult);

      this.sendNotification({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      });

      this.initialized = true;
    })().catch((error) => {
      this.initialized = false;
      this.initPromise = null;
      throw error;
    });

    return this.initPromise;
  }

  private sendNotification(message: {
    jsonrpc: "2.0";
    method: string;
    params?: Record<string, unknown>;
  }) {
    this.server.stdin.write(JSON.stringify(message) + "\n");
  }

  public async listTools(): Promise<unknown> {
    return this.sendMcpRequest({
      jsonrpc: "2.0",
      id: this.nextRequestId(),
      method: "tools/list",
    });
  }

  public async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    return this.sendMcpRequest({
      jsonrpc: "2.0",
      id: this.nextRequestId(),
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
    });
  }

  private nextRequestId(): number {
    return this.nextId++;
  }

  private sendMcpRequest(message: {
    jsonrpc: "2.0";
    id: number;
    method: string;
    params?: Record<string, unknown>;
  }): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.pending.set(message.id, { resolve, reject });

      try {
        this.server.stdin.write(JSON.stringify(message) + "\n");
      } catch (error) {
        this.pending.delete(message.id);
        reject(error);
      }
    });
  }
  private setupServerListeners(): void {
    this.server.stdout.on("data", (chunk: Buffer | string) => {
      this.buffer += chunk.toString();

      let newlineIndex = this.buffer.indexOf("\n");

      while (newlineIndex !== -1) {
        const rawLine = this.buffer.slice(0, newlineIndex).trim();
        this.buffer = this.buffer.slice(newlineIndex + 1);

        if (rawLine.length > 0) {
          this.handleServerMessage(rawLine);
        }

        newlineIndex = this.buffer.indexOf("\n");
      }
    });

    this.server.stderr.on("data", (chunk: Buffer | string) => {
      console.error("MCP server stderr:", chunk.toString());
    });

    this.server.on("exit", () => {
      for (const [, pending] of this.pending) {
        pending.reject(new Error("MCP server exited before responding"));
      }
      this.pending.clear();
    });
  }

  private handleServerMessage(rawLine: string): void {
    let parsed: JsonRpcResponse;

    try {
      parsed = JSON.parse(rawLine) as JsonRpcResponse;
    } catch (error) {
      console.error("Failed to parse MCP server response:", rawLine, error);
      return;
    }

    const request = this.pending.get(parsed.id);
    if (!request) return;

    this.pending.delete(parsed.id);

    if ("error" in parsed) {
      request.reject(
        new Error(`MCP error ${parsed.error.code}: ${parsed.error.message}`),
      );
      return;
    }

    request.resolve(parsed.result);
  }
}
