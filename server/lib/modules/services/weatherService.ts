import {
  GeocodeJsonSchema,
  GetWeatherResponseSchema,
  GetWeatherResponseSchemaType,
  LocationQuerySchemaType,
  OpenMeteoGeocodeResultType,
  WeatherForCityResultSchema,
  WeatherForCityResultType,
} from "@/schemas/weatherSchema";
import { WeatherResponseHandler } from "@/server/lib/modules/handlers/weatherResponseHandler";
import { WeatherResponse } from "../../types";

export class WeatherService {
  private readonly parser: WeatherResponseHandler;
  constructor() {
    this.parser = new WeatherResponseHandler();
  }

  public async getWeather(
    locationQuery: LocationQuerySchemaType,
  ): Promise<WeatherForCityResultType> {
    const raw = await this.getWeatherForCity(locationQuery);
    const weather = this.parser.parse(raw.geocode, raw.weather);
    return WeatherForCityResultSchema.parse(weather);
  }

  private async getWeatherForCity(
    locationQuery: LocationQuerySchemaType,
  ): Promise<GetWeatherResponseSchemaType> {
    const normalizedQuery = locationQuery.trim();
    const queryParts = this.parseLocationQuery(normalizedQuery);
    const geocodeCandidates = this.buildGeocodeCandidates(
      normalizedQuery,
      queryParts,
    );

    const firstResult = await this.findBestGeocodeResult(
      geocodeCandidates,
      queryParts,
    );

    if (!firstResult) {
      throw new Error(`No location found for query: ${locationQuery}`);
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

  private async findBestGeocodeResult(
    candidates: string[],
    queryParts: {
      zipCode?: string;
      city?: string;
      stateCode?: string;
      stateName?: string;
    },
  ): Promise<Record<string, unknown> | undefined> {
    for (const candidate of candidates) {
      const results = await this.searchLocations(candidate);

      if (!results.length) {
        continue;
      }

      const bestMatch = this.selectBestResult(results, queryParts);
      if (bestMatch) {
        return bestMatch;
      }
    }

    return undefined;
  }

  private async searchLocations(
    query: string,
  ): Promise<OpenMeteoGeocodeResultType[]> {
    const geocodeUrl = new URL(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    geocodeUrl.searchParams.set("name", query);
    geocodeUrl.searchParams.set("countryCode", "US");
    geocodeUrl.searchParams.set("count", "10");
    geocodeUrl.searchParams.set("language", "en");
    geocodeUrl.searchParams.set("format", "json");

    const geocodeRes = await fetch(geocodeUrl.toString());

    if (!geocodeRes.ok) {
      throw new Error(`Geocoding request failed: ${geocodeRes.status}`);
    }

    const raw = await geocodeRes.json();

    const geocodeJson = GeocodeJsonSchema.parse(raw);

    return geocodeJson.results ?? [];
  }

  private selectBestResult(
    results: Record<string, unknown>[],
    queryParts: {
      zipCode?: string;
      city?: string;
      stateCode?: string;
      stateName?: string;
    },
  ): Record<string, unknown> | undefined {
    if (queryParts.zipCode) {
      const zipMatch = results.find((result) => {
        const postcodes = Array.isArray(result.postcodes)
          ? result.postcodes
          : [];

        return postcodes.some(
          (postcode) =>
            typeof postcode === "string" && postcode === queryParts.zipCode,
        );
      });

      if (zipMatch) {
        return zipMatch;
      }
    }

    if (queryParts.city && queryParts.stateName) {
      const exactCityStateMatch = results.find((result) => {
        const name = this.normalizeText(result.name);
        const admin1 = this.normalizeText(result.admin1);

        return (
          name === this.normalizeText(queryParts.city) &&
          admin1 === this.normalizeText(queryParts.stateName)
        );
      });

      if (exactCityStateMatch) {
        return exactCityStateMatch;
      }
    }

    if (queryParts.city) {
      const cityMatch = results.find(
        (result) =>
          this.normalizeText(result.name) ===
          this.normalizeText(queryParts.city),
      );

      if (cityMatch) {
        return cityMatch;
      }
    }

    return results[0];
  }

  private buildGeocodeCandidates(
    normalizedQuery: string,
    queryParts: {
      zipCode?: string;
      city?: string;
      stateCode?: string;
      stateName?: string;
    },
  ): string[] {
    const candidates = new Set<string>();

    candidates.add(normalizedQuery);
    candidates.add(
      normalizedQuery.replace(/,/g, " ").replace(/\s+/g, " ").trim(),
    );

    if (queryParts.zipCode) {
      candidates.add(queryParts.zipCode);
    }

    if (queryParts.city && queryParts.stateName) {
      candidates.add(`${queryParts.city}, ${queryParts.stateName}`);
      candidates.add(`${queryParts.city} ${queryParts.stateName}`);
    }

    if (queryParts.city && queryParts.stateCode) {
      candidates.add(`${queryParts.city}, ${queryParts.stateCode}`);
      candidates.add(`${queryParts.city} ${queryParts.stateCode}`);
    }

    if (queryParts.city) {
      candidates.add(queryParts.city);
    }

    return [...candidates].filter((candidate) => candidate.length > 1);
  }

  private parseLocationQuery(locationQuery: string): {
    zipCode?: string;
    city?: string;
    stateCode?: string;
    stateName?: string;
  } {
    const zipCode = locationQuery.match(/\b\d{5}\b/)?.[0];
    const parts = locationQuery
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    let city = parts[0];
    let stateToken = parts[1];

    if (!stateToken && city) {
      const cityStateMatch = city.match(/^(.+?)\s+([A-Za-z]{2})$/);

      if (cityStateMatch) {
        city = cityStateMatch[1].trim();
        stateToken = cityStateMatch[2].trim();
      }
    }

    const stateCode = stateToken ? this.toStateCode(stateToken) : undefined;

    return {
      zipCode,
      city: city || undefined,
      stateCode,
      stateName: stateCode ? US_STATE_CODES[stateCode] : undefined,
    };
  }

  private toStateCode(value: string): string | undefined {
    const normalized = value.trim().toUpperCase();

    if (normalized in US_STATE_CODES) {
      return normalized;
    }

    const stateNameEntry = Object.entries(US_STATE_CODES).find(
      ([, stateName]) => stateName.toUpperCase() === normalized,
    );

    return stateNameEntry?.[0];
  }

  private normalizeText(value: unknown): string {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }
}

const US_STATE_CODES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
