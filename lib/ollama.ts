import { getEnv } from "./config";
import { Ollama } from "ollama";

const OLLAMA_API_KEY = getEnv("OLLAMA_KEY");

export const agent = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + OLLAMA_API_KEY,
  },
});
