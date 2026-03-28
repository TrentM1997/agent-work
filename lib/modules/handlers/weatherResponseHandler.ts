import {
  WeatherForCityResultType,
  OpenMeteoGeocodeResultType,
  OpenMeteoWeatherResultType,
} from "../utils/weatherSchema";

export type OpenMeteoGeocodeResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export type OpenMeteoWeatherResult = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    weather_code: number;
    is_day: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
  };
};

export class WeatherResponseHandler {
  constructor() {}

  public parse(
    geocode: OpenMeteoGeocodeResultType,
    weather: OpenMeteoWeatherResultType,
  ): WeatherForCityResultType {
    return {
      city: geocode.name,
      region: geocode.admin1,
      country: geocode.country,
      latitude: geocode.latitude,
      longitude: geocode.longitude,
      timezone: weather.timezone,
      observedAt: weather.current.time,

      current: {
        temperatureF: weather.current.temperature_2m,
        temperatureC: this.fahrenheitToCelsius(weather.current.temperature_2m),
        feelsLikeF: weather.current.apparent_temperature,
        feelsLikeC:
          weather.current.apparent_temperature !== undefined
            ? this.fahrenheitToCelsius(weather.current.apparent_temperature)
            : undefined,
        humidityPercent: weather.current.relative_humidity_2m,
        windSpeedMph: weather.current.wind_speed_10m,
        windSpeedKph:
          weather.current.wind_speed_10m !== undefined
            ? this.mphToKph(weather.current.wind_speed_10m)
            : undefined,
        windDirectionDegrees: weather.current.wind_direction_10m,
        windDirectionCardinal:
          weather.current.wind_direction_10m !== undefined
            ? this.toCardinalDirection(weather.current.wind_direction_10m)
            : undefined,
        conditions: this.mapWeatherCode(weather.current.weather_code),
        isDay: weather.current.is_day === 1,
      },

      forecast: weather.daily
        ? {
            today: {
              highF: weather.daily.temperature_2m_max?.[0],
              highC:
                weather.daily.temperature_2m_max?.[0] !== undefined
                  ? this.fahrenheitToCelsius(
                      weather.daily.temperature_2m_max[0],
                    )
                  : undefined,
              lowF: weather.daily.temperature_2m_min?.[0],
              lowC:
                weather.daily.temperature_2m_min?.[0] !== undefined
                  ? this.fahrenheitToCelsius(
                      weather.daily.temperature_2m_min[0],
                    )
                  : undefined,
              precipitationChancePercent:
                weather.daily.precipitation_probability_max?.[0],
              conditions:
                weather.daily.weather_code?.[0] !== undefined
                  ? this.mapWeatherCode(weather.daily.weather_code[0])
                  : undefined,
            },
          }
        : undefined,
    };
  }

  private fahrenheitToCelsius(tempF: number): number {
    return Number((((tempF - 32) * 5) / 9).toFixed(1));
  }

  private mphToKph(mph: number): number {
    return Number((mph * 1.60934).toFixed(1));
  }

  private toCardinalDirection(
    degrees: number,
  ): "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" {
    if (degrees >= 337.5 || degrees < 22.5) return "N";
    if (degrees < 67.5) return "NE";
    if (degrees < 112.5) return "E";
    if (degrees < 157.5) return "SE";
    if (degrees < 202.5) return "S";
    if (degrees < 247.5) return "SW";
    if (degrees < 292.5) return "W";
    return "NW";
  }

  private mapWeatherCode(code: number): string {
    switch (code) {
      case 0:
        return "Clear sky";
      case 1:
        return "Mostly clear";
      case 2:
        return "Partly cloudy";
      case 3:
        return "Overcast";
      case 45:
      case 48:
        return "Fog";
      case 51:
      case 53:
      case 55:
        return "Drizzle";
      case 61:
      case 63:
      case 65:
        return "Rain";
      case 71:
      case 73:
      case 75:
        return "Snow";
      case 80:
      case 81:
      case 82:
        return "Rain showers";
      case 95:
        return "Thunderstorm";
      default:
        return "Unknown";
    }
  }
}
