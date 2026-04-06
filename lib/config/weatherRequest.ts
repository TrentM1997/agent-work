import type { AgentRequestConfig } from "@/lib/config/agentRequest";
import type { ChatResponseSchemaType } from "@/schemas/chatResponseSchema";
import type { ConversationMessage } from "@/lib/types";

function createWeatherRequest(config: AgentRequestConfig) {
  return async (
    conversation: ConversationMessage[],
  ): Promise<ChatResponseSchemaType> => {
    try {
      const request = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation }),
      });

      if (!request.ok) {
        console.log(request.json());
        throw new Error(request.statusText);
      }

      return (await request.json()) as ChatResponseSchemaType;
    } catch (err) {
      return {
        ok: false,
        error: `${err}`,
      };
    }
  };
}

export { createWeatherRequest };
