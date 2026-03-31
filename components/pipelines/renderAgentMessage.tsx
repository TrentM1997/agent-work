import type { WeatherResultsType } from "@/lib/types";
import { AgentMessage } from "../agent/AgentMessage";
import AgentRunErrorAlert from "../feedback/agentRunErrorAlert";
import ShimmerText from "../feedback/shimmerText";
import { Fade } from "@mui/material";

export default function RenderAgentMessage({
  results,
}: {
  results: WeatherResultsType;
}) {

  switch (results.status) {
    case "pending": {
      return (
        <Fade 
        timeout={300}
        in={results.status === "pending"}
        >
            <div>
            <ShimmerText />
            </div>
        </Fade>
    );
    }
    case "ready": {
      return (
          <AgentMessage content={results.message} />
      );
    }
    case "failed": {
      return <AgentRunErrorAlert error={results.error} />;
    }

    default: {
      return null;
    }
  }
}
