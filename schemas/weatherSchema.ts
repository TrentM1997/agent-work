import { z } from "zod";

export const LocationQuerySchema = z.string();

export type LocationQuerySchemaType = z.infer<typeof LocationQuerySchema>;

const WindDirectionCardinalSchema = z.enum([
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
]);

const CurrentWeatherSchema = z.object({
  temperatureC: z.number(),
  temperatureF: z.number(),
  feelsLikeC: z.number().optional(),
  feelsLikeF: z.number().optional(),
  humidityPercent: z.number().optional(),
  windSpeedKph: z.number().optional(),
  windSpeedMph: z.number().optional(),
  windDirectionDegrees: z.number().optional(),
  windDirectionCardinal: WindDirectionCardinalSchema.optional(),
  conditions: z.string(),
  isDay: z.boolean(),
});

const TodayForecastSchema = z.object({
  highC: z.number().optional(),
  highF: z.number().optional(),
  lowC: z.number().optional(),
  lowF: z.number().optional(),
  precipitationChancePercent: z.number().optional(),
  conditions: z.string().optional(),
});

export const WeatherForCityResultSchema = z.object({
  city: z.string(),
  region: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  observedAt: z.string(),

  current: CurrentWeatherSchema,

  forecast: z
    .object({
      today: TodayForecastSchema.optional(),
    })
    .optional(),
});

export const GetWeatherForCityInputSchema = z.object({
  city: z.string().min(1),
  country: z.string().optional(),
});

export const LocationRequestedSchema = z.object({
  city: z.string().min(1),
  state: z.string(),
  zip: z.string(),
});

export type LocationRequestedSchemaType = z.infer<
  typeof LocationRequestedSchema
>;

export type GetWeatherForCityInputSchemaType = z.infer<
  typeof GetWeatherForCityInputSchema
>;

export type WeatherForCityResultType = z.infer<
  typeof WeatherForCityResultSchema
>;

export const OpenMeteoGeocodeResultSchema = z.object({
  name: z.string(),
  country: z.string().optional(),
  admin1: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const OpenMeteoWeatherCurrentSchema = z.object({
  time: z.string(),
  temperature_2m: z.number(),
  apparent_temperature: z.number().optional(),
  relative_humidity_2m: z.number().optional(),
  wind_speed_10m: z.number().optional(),
  wind_direction_10m: z.number().optional(),
  weather_code: z.number(),
  is_day: z.number(),
});

export const OpenMeteoWeatherDailySchema = z.object({
  temperature_2m_max: z.array(z.number()).optional(),
  temperature_2m_min: z.array(z.number()).optional(),
  precipitation_probability_max: z.array(z.number()).optional(),
  weather_code: z.array(z.number()).optional(),
});

export const OpenMeteoWeatherResultSchema = z.object({
  timezone: z.string(),
  current: OpenMeteoWeatherCurrentSchema,
  daily: OpenMeteoWeatherDailySchema.optional(),
});

export const OpenMeteoGeocodeSearchResponseSchema = z.object({
  results: z.array(OpenMeteoGeocodeResultSchema).optional(),
});

export const GetWeatherResponseSchema = z.object({
  geocode: OpenMeteoGeocodeResultSchema,
  weather: OpenMeteoWeatherResultSchema,
});

export type GetWeatherResponseSchemaType = z.infer<
  typeof GetWeatherResponseSchema
>;

export type OpenMeteoGeocodeResultType = z.infer<
  typeof OpenMeteoGeocodeResultSchema
>;

export type OpenMeteoWeatherResultType = z.infer<
  typeof OpenMeteoWeatherResultSchema
>;
