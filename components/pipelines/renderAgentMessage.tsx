import type { WeatherResultsType } from "@/lib/hooks/useGetWeather";
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
        <Fade in={results.status === "pending"}>
            <div>
            <ShimmerText />
            </div>
        </Fade>
    );
    }
    case "ready": {
      return (
        <Fade in={results.status === "ready"}>
          <AgentMessage content={results.message} />
        </Fade>
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
