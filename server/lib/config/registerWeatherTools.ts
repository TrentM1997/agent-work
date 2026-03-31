import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WeatherService } from "@/server/lib/modules/services/weatherService";

type RegisterWeatherToolsArgs = {
  server: McpServer;
  weatherService: WeatherService;
};

export function registerWeatherTools({
  server,
  weatherService,
}: RegisterWeatherToolsArgs) {
  server.registerTool(
    "open_weather_api",
    {
      title: "Get the weather",
      description: "Get the weather from the Open Weather API",
      inputSchema: {
        location: z.object({
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      },
    },
    async ({ location }) => {
      const weather = await weatherService.getWeather(location);

      return {
        content: [{ type: "text", text: JSON.stringify(weather, null, 2) }],
      };
    },
  );
}
