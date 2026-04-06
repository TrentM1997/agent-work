import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WeatherService } from "@/server/lib/modules/services/weatherService";
import { LocationQuerySchema } from "@/schemas/weatherSchema";

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
        locationQuery: LocationQuerySchema,
      },
    },
    async ({ locationQuery }) => {
      const weather = await weatherService.getWeather(locationQuery);

      return {
        content: [{ type: "text", text: JSON.stringify(weather, null, 2) }],
      };
    },
  );
}
