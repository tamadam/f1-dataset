"use client";

import React, { createContext, useContext } from "react";
import { Race } from "@/app/types/races";

interface RacesContextValue {
  races: Race[];
}

const RacesContext = createContext<RacesContextValue | undefined>(undefined);

export const RacesProvider = ({
  races,
  children,
}: {
  races: Race[];
  children: React.ReactNode;
}) => {
  return (
    <RacesContext.Provider value={{ races }}>{children}</RacesContext.Provider>
  );
};

export const useRaces = () => {
  const ctx = useContext(RacesContext);
  if (!ctx) throw new Error("useRaces must be used within RacesProvider");
  return ctx.races;
};
