import { AgentApi } from "@/lib/transport/agentApi";

export const agentApi = new AgentApi({
  endpoint: "/api/weather",
  method: "POST",
});
