"use client";

import { useEffect, useState } from "react";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race } from "@/app/types/races";
import { F1_API_BASE_URL } from "@/app/constants";

interface NextSessionCounterWrapperProps {
  locale: string;
  currentYear: number;
}

const CACHE_KEY = "f1_dataset_races_list";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days

const NextSessionCounterWrapper = ({
  locale,
  currentYear,
}: NextSessionCounterWrapperProps) => {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        // Check localStorage cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setRaces(parsed.data);

            return;
          }
        }

        // Fetch fresh data
        const raw = await fetch(`${F1_API_BASE_URL}/${currentYear}/races`, {
          cache: "no-store",
        });
        const res = await raw.json();
        const raceData = res?.MRData?.RaceTable?.Races || [];

        // Save to localStorage
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: raceData })
        );

        setRaces(raceData);
      } catch (e) {
        console.error("Failed to fetch races on client:", e);
      }
    };

    fetchRaces();
  }, []);

  if (races.length === 0) return null;

  return <NextSessionCounter races={races} locale={locale} />;
};

export default NextSessionCounterWrapper;
