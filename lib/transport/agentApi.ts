import type { LocationRequestedSchemaType } from "@/schemas/weatherSchema";
import type { AgentRequestConfig } from "@/lib/config/config";
import type { ChatResponse } from "@/server/lib/agent/types";
import { createWeatherRequest } from "./weatherRequest";
import {
  ChatResponseSchema,
  ChatResponseSchemaType,
} from "@/schemas/chatResponseSchema";
import z from "zod";

type RequestWeatherTransport = (location: {
  city: string;
  state: string;
  zip: string;
}) => Promise<ChatResponse>;

export class AgentApi {
  private readonly request: RequestWeatherTransport;
  constructor(private readonly config: AgentRequestConfig) {
    this.request = createWeatherRequest(this.config);
  }

  public async getWeatherReport(
    location: LocationRequestedSchemaType,
  ): Promise<ChatResponseSchemaType> {
    const response = await this.request(location);

    return this.parseAgentRunResult(response, ChatResponseSchema);
  }

  private parseAgentRunResult<T>(response: unknown, schema: z.ZodType<T>): T {
    return schema.parse(response);
  }
}
