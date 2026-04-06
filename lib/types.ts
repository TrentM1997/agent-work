import type {
  ChatResponseSchemaType,
  ConversationMessageSchemaType,
} from "@/schemas/chatResponseSchema";

export type ConversationMessage = ConversationMessageSchemaType;

export type WeatherResultsType =
  | {
      status: "initial";
      conversation?: ConversationMessage[];
    }
  | {
      status: "pending";
      conversation?: ConversationMessage[];
    }
  | {
      status: "ready";
      message: string;
      conversation?: ConversationMessage[];
    }
  | {
      status: "failed";
      error: string;
      conversation?: ConversationMessage[];
    };

export type ChatWithAgentHook = {
  userMessage: string;
  results: WeatherResultsType;
  sendMessage: () => Promise<void>;
  getInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
};

export type RequestWeatherTransport = (
  conversation: ConversationMessage[],
) => Promise<ChatResponseSchemaType>;
