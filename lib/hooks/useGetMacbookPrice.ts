import { useState } from "react";

export const useGetMacbookPrice = () => {
  const [pricing, setPricing] = useState<string>("");

  const getMacPricing = async () => {
    try {
      const req = await fetch("/api/shop", {
        method: "POST",
        body: JSON.stringify({
          prompt: "Please tell me the cost of a new macbook pro from apple",
        }),
      });
      const res = await req.json();
      setPricing(res);
    } catch (err) {
      console.error(err);
    }
  };

  return { getMacPricing, pricing };
};
