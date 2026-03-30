import { useState } from "react";
import type {
  GetWeatherHook,
  WeatherResultsType,
  LocationInputState,
} from "@/server/lib/types";
import { weatherRequest } from "../api/requests";

export const useGetWeather = (): GetWeatherHook => {
  const [location, setLocation] = useState<LocationInputState>({
    city: "",
    state: "",
    zip: "",
  });
  const [results, setResults] = useState<WeatherResultsType>({
    status: "initial",
  });

  const getCityInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const cityInput = value.toLowerCase().trim();

    setLocation((prev: LocationInputState) => ({
      ...prev,
      city: cityInput,
    }));
  };

  const getStateInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const stateInput = value.toLowerCase().trim();

    setLocation((prev: LocationInputState) => ({
      ...prev,
      state: stateInput,
    }));
  };

  const getZipInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const zipInput = value.toLowerCase().trim();

    setLocation((prev: LocationInputState) => ({
      ...prev,
      zip: zipInput,
    }));
  };

  const submit = async () => {
    setResults({ status: "pending" });

    const request = await weatherRequest(location);

    if (request.ok) {
      setResults({ status: "ready", message: request.message });
    } else {
      setResults({
        status: "failed",
        error: `Agent run failed to retrieve a weather report for ${location.city}`,
      });
    }
  };

  return {
    results,
    getWeather: submit,
    getCityInput,
    getStateInput,
    getZipInput,
  };
};
