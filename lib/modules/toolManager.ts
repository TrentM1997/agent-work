import type { Tool } from "ai";
import { type ChildProcessWithoutNullStreams } from "child_process";
export type WeatherLocale = {
  city: string;
  state: string;
  zip: string;
};

export class ToolManager {
  public tools: Record<string, Tool>;

  constructor(private readonly server: ChildProcessWithoutNullStreams) {
    this.tools = {};
  }

  public registerTool(fn: Tool) {
    if (fn.description) {
      const toolName = fn.description;
      this.tools[toolName] = fn;
    }
  }

  public async executeTool(
    name: string,
    location: WeatherLocale,
    signal: AbortController["signal"],
  ) {
    return this.tools[name]?.execute?.(
      { location: location },
      { abortSignal: signal, toolCallId: "", messages: [] },
    );
  }
}
