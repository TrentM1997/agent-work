import "./envConfig";

type EnvironmentVariable = "OLLAMA_KEY";

export function getEnv(env: EnvironmentVariable) {
  if (env === "OLLAMA_KEY") {
    return process.env.OLLAMA_KEY;
  }
}
