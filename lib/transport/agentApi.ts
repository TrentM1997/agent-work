import type { AgentRequestConfig } from "../config/agentRequest";
import type { ConversationMessage, RequestWeatherTransport } from "@/lib/types";
import { createWeatherRequest } from "../config/weatherRequest";
import {
  ChatResponseSchema,
  ChatResponseSchemaType,
} from "@/schemas/chatResponseSchema";
import z from "zod";

export class AgentApi {
  private readonly requestWeather: RequestWeatherTransport;
  constructor(private readonly config: AgentRequestConfig) {
    this.requestWeather = createWeatherRequest(this.config);
  }

  public async sendConversation(
    conversation: ConversationMessage[],
  ): Promise<ChatResponseSchemaType> {
    const response = await this.requestWeather(conversation);
    return this.parseAgentRunResult(response, ChatResponseSchema);
  }

  private parseAgentRunResult<T>(response: unknown, schema: z.ZodType<T>): T {
    return schema.parse(response);
  }
}
