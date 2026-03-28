import {
  GetWeatherForCityInputSchemaType,
  GetWeatherResponseSchema,
  GetWeatherResponseSchemaType,
  WeatherForCityResultSchema,
  WeatherForCityResultType,
} from "../../utils/weatherSchema";
import { WeatherResponseHandler } from "@/lib/modules/handlers/weatherResponseHandler";

export class WeatherService {
  private readonly parser: WeatherResponseHandler;
  constructor() {
    this.parser = new WeatherResponseHandler();
  }

  public async getWeather(
    input: GetWeatherForCityInputSchemaType,
  ): Promise<WeatherForCityResultType> {
    const raw = await this.getWeatherForCity(input);
    const weather = this.parser.parse(raw.geocode, raw.weather);
    return WeatherForCityResultSchema.parse(weather);
  }

  private async getWeatherForCity(
    input: GetWeatherForCityInputSchemaType,
  ): Promise<GetWeatherResponseSchemaType> {
    const geocodeUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    geocodeUrl.searchParams.set("name", input.city);
    geocodeUrl.searchParams.set("count", "1");
    geocodeUrl.searchParams.set("language", "en");
    geocodeUrl.searchParams.set("format", "json");

    const geocodeRes = await fetch(geocodeUrl.toString());

    if (!geocodeRes.ok) {
      throw new Error(`Geocoding request failed: ${geocodeRes.status}`);
    }

    const geocodeJson = await geocodeRes.json();

    const firstResult = geocodeJson.results?.[0];

    if (!firstResult) {
      throw new Error(`No location found for city: ${input.city}`);
    }

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(firstResult.latitude));
    weatherUrl.searchParams.set("longitude", String(firstResult.longitude));

    weatherUrl.searchParams.set(
      "current",
      [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "wind_speed_10m",
        "wind_direction_10m",
        "weather_code",
        "is_day",
      ].join(","),
    );

    weatherUrl.searchParams.set(
      "daily",
      [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
        "weather_code",
      ].join(","),
    );

    weatherUrl.searchParams.set("temperature_unit", "fahrenheit");
    weatherUrl.searchParams.set("wind_speed_unit", "mph");
    weatherUrl.searchParams.set("precipitation_unit", "inch");
    weatherUrl.searchParams.set("timezone", "auto");

    const weatherRes = await fetch(weatherUrl.toString());

    if (!weatherRes.ok) {
      throw new Error(`Weather request failed: ${weatherRes.status}`);
    }

    const weatherJson = await weatherRes.json();

    return GetWeatherResponseSchema.parse({
      geocode: firstResult,
      weather: weatherJson,
    });
  }
}
