import type { WeatherResultsType } from "@/lib/hooks/useGetWeather";
import { AgentMessage } from "../agent/AgentMessage";
import AgentRunErrorAlert from "../feedback/agentRunErrorAlert";
import ShimmerText from "../feedback/shimmerText";


export default function RenderAgentMessage({results} :{results: WeatherResultsType}) {

    switch(results.status) {

        case "pending": {
            return (
                <ShimmerText />
            )
        }
        case "ready": {
            return (
                <AgentMessage
                content={results.message}
                />
            )
        }
        case "failed": {
            return (
                <AgentRunErrorAlert 
                error={results.error}
                />
            )
        }

        default: {
            return null;
        }
    }
}