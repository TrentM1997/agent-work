import "./envConfig";

type EnvironmentVariable = "NEXT_PUBLIC_OLLAMA_KEY";

export function getEnv(env: EnvironmentVariable) {
  if (env === "NEXT_PUBLIC_OLLAMA_KEY") {
    return process.env.NEXT_PUBLIC_OLLAMA_KEY;
  }
}
