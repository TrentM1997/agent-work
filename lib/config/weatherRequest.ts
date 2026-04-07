import type { AgentRequestConfig } from "@/lib/config/agentRequest";
import type { ChatResponseSchemaType } from "@/schemas/chatResponseSchema";
import type { ConversationMessage } from "@/lib/types";

function createWeatherRequest(config: AgentRequestConfig) {
  return async (
    conversation: ConversationMessage[],
    onChunk: (message: string) => void,
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
        const errorPayload = await request.json().catch(() => null);
        const message =
          typeof errorPayload === "object" &&
          errorPayload !== null &&
          "error" in errorPayload &&
          typeof errorPayload.error === "string"
            ? errorPayload.error
            : request.statusText;

        throw new Error(message);
      }

      if (!request.body) {
        throw new Error("Streaming response body was unavailable");
      }

      const reader = request.body.getReader();
      const decoder = new TextDecoder();
      let message = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (!chunk) {
          continue;
        }

        message += chunk;
        onChunk(message);
      }

      const lastChunk = decoder.decode();
      if (lastChunk) {
        message += lastChunk;
        onChunk(message);
      }

      return {
        ok: true,
        message,
      };
    } catch (err) {
      return {
        ok: false,
        error: `${err}`,
      };
    }
  };
}

export { createWeatherRequest };
