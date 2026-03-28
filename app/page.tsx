"use client";
import Image from "next/image";
import AgentChat from "@/components/agentChat";
import { useGetWeather } from "@/lib/hooks/useGetWeather";
import { useGetMacbookPrice } from "@/lib/hooks/useGetMacbookPrice";

export default function Home() {
  const { getWeather, results } = useGetWeather();
  const { pricing, getMacPricing } = useGetMacbookPrice();

  console.log(pricing)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row py-12">
          <button
            onClick={getWeather}
            type="button"
            className="flex h-12 w-full text-sm items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Get Weather
          </button>
          <a
          onClick={getMacPricing}
            href="#"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-12 px-16 bg-white dark:bg-black sm:items-start">

        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch border border-zinc-400 rounded-b-md h-40 overflow-y-scroll scroll-auto">
          {pricing}
        </div>
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch border border-zinc-400 rounded-b-md h-40 overflow-y-scroll scroll-auto">
          {results}
        </div>
        
      <AgentChat />
      </main>
        

    </div>
  );
}
