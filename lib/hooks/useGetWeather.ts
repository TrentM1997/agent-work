import { useState } from "react";

type LocationInputState = {
  city: string;
  state: string;
  zip: string;
};

export type WeatherResultsType =
  | {
      status: "initial";
    }
  | {
      status: "pending";
    }
  | {
      status: "ready";
      message: string;
    }
  | {
      status: "failed";
      error: string;
    };

export type GetWeatherHook = {
  results: WeatherResultsType;
  getWeather: () => Promise<void>;
  getCityInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
  getStateInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
  getZipInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => void;
};

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
      city: stateInput,
    }));
  };

  const getZipInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const zipInput = value.toLowerCase().trim();

    setLocation((prev: LocationInputState) => ({
      ...prev,
      city: zipInput,
    }));
  };

  const getWeather = async () => {
    setResults({ status: "pending" });

    try {
      const request = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      if (!request.ok) {
        throw new Error(request.statusText);
      }

      const res = await request.json();
      setResults({ status: "ready", message: res });
    } catch (err) {
      console.error(err);
      setResults({
        status: "failed",
        error:
          typeof err === "string"
            ? err
            : "Unkown error encountered with agent run response",
      });
    }
  };

  return {
    results,
    getWeather,
    getCityInput,
    getStateInput,
    getZipInput,
  };
};
