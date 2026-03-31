import type { LocationRequestedSchemaType } from "@/schemas/weatherSchema";
import type { AgentRequestConfig } from "@/lib/config/agentRequest";
import type { ChatResponseSchemaType } from "@/schemas/chatResponseSchema";

function createWeatherRequest(config: AgentRequestConfig) {
  return async (
    location: LocationRequestedSchemaType,
  ): Promise<ChatResponseSchemaType> => {
    try {
      const request = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      if (!request.ok) {
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
