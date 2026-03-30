import { useState } from "react";
import type {
  GetWeatherHook,
  WeatherResultsType,
  LocationInputState,
  GetTargetValueField,
} from "@/lib/types";
import { agentApi } from "@/lib/config/agentRequest";

export const useGetWeather = (): GetWeatherHook => {
  const [location, setLocation] = useState<LocationInputState>({
    city: "",
    state: "",
    zip: "",
  });
  const [results, setResults] = useState<WeatherResultsType>({
    status: "initial",
  });

  const getInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    inputField: GetTargetValueField,
  ) => {
    const value = e.target.value;
    const cleansedInput = value.toLowerCase().trim();
    const field = inputField;
    setLocation((prev: LocationInputState) => ({
      ...prev,
      [field]: cleansedInput,
    }));
  };

  const getWeather = async () => {
    setResults({ status: "pending" });

    const response = await agentApi.getWeatherReport(location);
    if (!response.ok) {
      setResults({
        status: "failed",
        error: response.error,
      });
      return;
    }

    setResults({ status: "ready", message: response.message });
  };

  return {
    results,
    getWeather,
    getInput,
  };
};
