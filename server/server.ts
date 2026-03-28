import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { WeatherService } from "@/server/lib/modules/services/weatherService";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

server.registerTool(
  "get_weather",
  {
    title: "Get Weather",
    description: "Get the weather in a location",
    inputSchema: {
      location: z.object({
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    },
  },
  async ({ location }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            temp: 72,
            conditions: "sunny",
            location: `${location.city}, ${location.state} ${location.zip}`,
          }),
        },
      ],
    };
  },
);
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
    const weatherApi = new WeatherService();

    const weather = await weatherApi.getWeather(location);

    return {
      content: [{ type: "text", text: JSON.stringify(weather, null, 2) }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
