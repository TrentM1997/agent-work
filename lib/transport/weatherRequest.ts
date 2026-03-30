import type { LocationRequestedSchemaType } from "@/schemas/weatherSchema";
import type { AgentRequestConfig } from "../config/agentRequestConfig";
import type { ChatResponse } from "@/server/lib/agent/types";

function createWeatherRequest(config: AgentRequestConfig) {
  return async (
    location: LocationRequestedSchemaType,
  ): Promise<ChatResponse> => {
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

      return (await request.json()) as ChatResponse;
    } catch (err) {
      return {
        ok: false,
        error: `${err}`,
      };
    }
  };
}

export { createWeatherRequest };
