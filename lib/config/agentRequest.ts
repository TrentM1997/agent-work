import { AgentApi } from "@/lib/transport/agentApi";

export const agentApi = new AgentApi({
  endpoint: "/api/weather",
  method: "POST",
});

export type AgentRequestConfig = {
  endpoint: "/api/weather";
  method: "POST";
};
