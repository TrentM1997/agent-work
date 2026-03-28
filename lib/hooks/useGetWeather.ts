import { useState } from "react";

type GetWeatherHook = {
  results: string;
  getWeather: () => Promise<void>;
};

export const useGetWeather = (): GetWeatherHook => {
  const [results, setResults] = useState<string>("");

  const getWeather = async () => {
    try {
      const request = await fetch("/api/weather", { method: "GET" });

      const res = await request.json();

      console.log(res);
      setResults(res);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    results,
    getWeather,
  };
};
