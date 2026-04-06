import type { ConversationMessage, WeatherResultsType } from "@/lib/types";
import { Fade, Stack } from "@mui/material";
import { AgentMessage } from "../agent/AgentMessage";
import AgentRunErrorAlert from "../feedback/agentRunErrorAlert";
import ShimmerText from "../feedback/shimmerText";

function getConversation(results: WeatherResultsType): ConversationMessage[] {
  if (results.conversation?.length) {
    return results.conversation;
  }

  if (results.status === "ready") {
    return [{ role: "assistant", content: results.message }];
  }

  return [];
}

export default function RenderAgentMessage({
  results,
}: {
  results: WeatherResultsType;
}) {
  const conversation = getConversation(results);

  switch (results.status) {
    case "pending": {
      return (
        <Fade timeout={300} in={results.status === "pending"}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            {conversation.length > 0 ? (
              <AgentMessage conversation={conversation} />
            ) : null}
            <ShimmerText />
          </Stack>
        </Fade>
      );
    }
    case "ready": {
      return (
        <Fade in={results.status === "ready"} timeout={300}>
          <div style={{ width: "100%" }}>
            <AgentMessage conversation={conversation} />
          </div>
        </Fade>
      );
    }
    case "failed": {
      return (
        <Stack spacing={2} sx={{ width: "100%" }}>
          {conversation.length > 0 ? (
            <AgentMessage conversation={conversation} />
          ) : null}
          <AgentRunErrorAlert error={results.error} />
        </Stack>
      );
    }

    default: {
      return null;
    }
  }
}
