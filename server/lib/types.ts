export type LocationInputState = {
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
