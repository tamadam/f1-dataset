"use client";

import { useEffect, useState } from "react";
import { getCurrentYear } from "@/app/lib/year-utils";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race } from "@/app/types/races";
import { F1_API_BASE_URL } from "../constants";

interface Props {
  locale: string;
}

const ClientSessions = ({ locale }: Props) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const currentYear = getCurrentYear();
        const raw = await fetch(`${F1_API_BASE_URL}/${currentYear}/races`);
        const res = await raw.json();
        setRaces(res?.MRData?.RaceTable?.Races || []);
      } catch (e) {
        console.error("Failed to fetch races on client:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) return <div>Loading sessions...</div>;
  if (races.length === 0) return <div>No upcoming sessions</div>;

  return <NextSessionCounter races={races} locale={locale} />;
};

export default ClientSessions;
