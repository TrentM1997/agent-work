import type { ConversationMessage, WeatherResultsType } from "@/lib/types";
import { Fade, Stack } from "@mui/material";
import AgentRunErrorAlert from "../feedback/agentRunErrorAlert";
import ShimmerText from "../feedback/shimmerText";
import ChatContainer from "../chat/chatContainer";
import ChatStream from "../chat/chatStream";

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
                <ChatStream transcript={conversation} />
            ) : null}
            <ShimmerText />
          </Stack>
        </Fade>
      );
    }
    case "ready": {
      return (
        <Fade in={results.status === "ready"} timeout={300}>
          <Stack spacing={2} sx={{ width: "100%" }}>
                <ChatStream transcript={conversation} />
          </Stack>
        </Fade>
      );
    }
    case "failed": {
      return (
        <Stack spacing={2} sx={{ width: "100%" }}>
          {conversation.length > 0 ? (
                <ChatStream transcript={conversation} />
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
