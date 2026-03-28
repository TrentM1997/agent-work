import "./envConfig";

type EnvironmentVariable = "OLLAMA_KEY" | "AI_GATEWAY_KEY";

export function getEnv(env: EnvironmentVariable) {
  switch (env) {
    case "OLLAMA_KEY": {
      return process.env.OLLAMA_KEY;
    }
    case "AI_GATEWAY_KEY": {
      return process.env.AI_GATEWAY_KEY;
    }
  }
}
