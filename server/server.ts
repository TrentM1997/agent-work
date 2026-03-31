import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WeatherService } from "@/server/lib/modules/services/weatherService";
import { registerWeatherTools } from "@/server/lib/config/registerWeatherTools";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

const weatherService = new WeatherService();

registerWeatherTools({
  server,
  weatherService,
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
