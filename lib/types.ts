import { ChatResponseSchemaType } from "@/schemas/chatResponseSchema";
import { ChatResponse } from "@/server/lib/agent/types";

export type LocationInputState = {
  city: string;
  state: string;
  zip: string;
};

export type WeatherResultsType =
  | {
      status: "initial";
    }
  | {
      status: "pending";
    }
  | {
      status: "ready";
      message: string;
    }
  | {
      status: "failed";
      error: string;
    };

export type GetTargetValueField = keyof LocationInputState;

export type GetWeatherHook = {
  results: WeatherResultsType;
  getWeather: () => Promise<void>;
  getInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    inputField: GetTargetValueField,
  ) => void;
};

export type RequestWeatherTransport = (location: {
  city: string;
  state: string;
  zip: string;
}) => Promise<ChatResponseSchemaType>;
