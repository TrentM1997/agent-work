type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: number;
  result: unknown;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: number;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

type ToolRequest = {
  tool_name: string;
  parameters: Record<string, unknown>;
};

type Decision =
  | { kind: "final"; content: string }
  | {
      kind: "tool_call";
      toolName: string;
      parameters: Record<string, unknown>;
    };

export type {
  JsonRpcResponse,
  JsonRpcSuccess,
  JsonRpcError,
  ToolRequest,
  Decision,
};
