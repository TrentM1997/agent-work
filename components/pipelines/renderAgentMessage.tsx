import type { WeatherResultsType } from "@/lib/hooks/useGetWeather";
import { AgentMessage } from "../AgentMessage";
import SimpleBackdrop from "../simpleBackgrop";
import AgentRunErrorAlert from "../agentRunErrorAlert";


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