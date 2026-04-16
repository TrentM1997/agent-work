import { randomUUID } from "crypto";

const ENABLE_MODEL_TRACE =
  process.env.NODE_ENV !== "production" &&
  process.env.DEBUG_MODEL_OUTPUT === "true";

const MAX_LOG_CHARS = 1000;

type ModelTrace = {
  append: (chunk: string) => void;
  flush: () => void;
  fail: (error: unknown) => void;
};

const noopTrace: ModelTrace = {
  append() {},
  flush() {},
  fail() {},
};

function redactForLogs(value: string): string {
  return value
    .replace(/\b\d{5}(?:-\d{4})?\b/g, "[ZIP]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]");
}

export function createModelTrace(scope: string): ModelTrace {
  if (!ENABLE_MODEL_TRACE) {
    return noopTrace;
  }

  const requestId = randomUUID().slice(0, 8);
  let buffer = "";

  return {
    append(chunk: string) {
      buffer += chunk;
    },

    flush() {
      const preview = redactForLogs(buffer).slice(0, MAX_LOG_CHARS);
      console.debug(`[model:${scope}:${requestId}] ${preview}`);
      buffer = "";
    },

    fail(error: unknown) {
      const preview = redactForLogs(buffer).slice(0, MAX_LOG_CHARS);
      console.error(`[model:${scope}:${requestId}] failed`, {
        error,
        partialResponse: preview,
      });
      buffer = "";
    },
  };
}
