import { createWeatherRequest } from "@/lib/transport/weatherRequest";

export const weatherRequest = createWeatherRequest({
  endpoint: "/api/weather",
  method: "POST",
});
