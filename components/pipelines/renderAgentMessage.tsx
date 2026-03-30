import type { WeatherResultsType } from "@/lib/hooks/useGetWeather";
import { AgentMessage } from "../agent/AgentMessage";
import SimpleBackdrop from "../feedback/simpleBackgrop";
import AgentRunErrorAlert from "../feedback/agentRunErrorAlert";


export default function RenderAgentMessage({results} :{results: WeatherResultsType}) {

    switch(results.status) {

        case "pending": {
            return (
                <SimpleBackdrop 
                status={results.status}
                />
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