"use client";

import { DETAILS, F1_API_BASE_URL } from "@/app/constants";
import { Race } from "@/app/types/races";
import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import styles from "./NextSessionCounter.module.scss";
import { Link } from "@/i18n/navigation";
import { getCountryCodeFromName } from "@/app/lib/country-utils";
import Flag from "../Flag/Flag";
import {
  formatRaceDateRange,
  getValidLocaleForDate,
} from "@/app/lib/date-utils";
import { ArrowRight } from "../icons";
import { useTranslations } from "next-intl";
import clsx from "clsx";

const SESSION_DURATIONS = {
  fortyMinutes: 60 * 40,
  oneHour: 60 * 60 * 1000,
  oneAndAHalfHours: 60 * 90,
};

interface NextSessionCounterProps {
  locale: string;
}

const NextSessionCounter = ({ locale }: NextSessionCounterProps) => {
  const [isClient, setIsClient] = useState(false);
  const [races, setRaces] = useState<Race[]>([]);

  const translate = useTranslations("General");

  useEffect(() => {
    async function fetchRaces() {
      try {
        const year = new Date().getFullYear();
        const res = await fetch(`${F1_API_BASE_URL}/${year}/races`, {
          next: { revalidate: 3600 },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRaces(data?.MRData?.RaceTable?.Races ?? []);
      } catch (err) {
        console.error("Failed to fetch races:", err);
        setRaces([]);
      } finally {
        setIsClient(true);
      }
    }

    fetchRaces();
  }, []);

  if (!isClient) return null;
  const [currentDate, time] = new Date().toISOString().split("T");
  const currentTime = time.split(".")[0] + "Z";

  const finalCurrentDate = new Date(`${currentDate}T${currentTime}`);

  const racesWithSessions = races.map((race) => {
    const sessions = [
      {
        ...race[DETAILS.FirstPractice],
        sessionName: translate("practice1"),
        sessionEstimatedDuration: SESSION_DURATIONS.oneHour,
      },
      {
        ...race[DETAILS.SecondPractice],
        sessionName: translate("practice2"),
        sessionEstimatedDuration: SESSION_DURATIONS.oneHour,
      },
      {
        ...race[DETAILS.ThirdPractice],
        sessionName: translate("practice3"),
        sessionEstimatedDuration: SESSION_DURATIONS.oneHour,
      },
      {
        ...race[DETAILS.Qualifying],
        sessionName: translate("qualifying"),
        sessionEstimatedDuration: SESSION_DURATIONS.oneHour,
      },
      {
        ...race[DETAILS.SprintShootout],
        sessionName: translate("sprintShootout"),
        sessionEstimatedDuration: SESSION_DURATIONS.fortyMinutes,
      },
      {
        ...race[DETAILS.SprintQualifying],
        sessionName: translate("sprintQualifying"),
        sessionEstimatedDuration: SESSION_DURATIONS.fortyMinutes,
      },
      {
        ...race[DETAILS.Sprint],
        sesssionName: translate("sprint"),
        sessionEstimatedDuration: SESSION_DURATIONS.fortyMinutes,
      },
      {
        date: race.date,
        time: race.time,
        sessionName: translate("race"),
        sessionEstimatedDuration: SESSION_DURATIONS.oneAndAHalfHours,
      },
    ]
      .filter(
        (
          s
        ): s is {
          date: string;
          time?: string;
          sessionName: string;
          sessionEstimatedDuration: number;
        } => !!s?.date
      )
      .map((session) => ({
        ...session,
        iso: `${session.date}T${session.time ?? "00:00:00Z"}`,
      }))
      .sort((a, b) => {
        return new Date(a.iso).getTime() - new Date(b.iso).getTime();
      });

    return {
      circuitId: race.Circuit.circuitId,
      circuitName: race.Circuit.circuitName,
      country: race.Circuit.Location.country,
      raceName: race.raceName,
      round: race.round,
      sessions,
    };
  });

  const nextRace = racesWithSessions
    .flatMap((race) =>
      race.sessions.map((session) => ({ ...race, nextSession: session }))
    )
    .find(({ nextSession }) => {
      const sessionStart = new Date(nextSession.iso).getTime();
      const nowTime = finalCurrentDate.getTime();

      // Session is either upcoming OR currently ongoing
      return (
        sessionStart > nowTime ||
        (nowTime >= sessionStart &&
          nowTime < sessionStart + nextSession.sessionEstimatedDuration)
      );
    });

  // All races are done for the year / not yet available from the api for the current year
  if (!nextRace || nextRace.sessions.length === 0) return null;

  const nextEventYear = nextRace.sessions[0].date.split("-")[0];
  const formattedDate = formatRaceDateRange(
    new Date(nextRace.sessions[0].date),
    new Date(nextRace.sessions.at(-1)!.date),
    getValidLocaleForDate(locale)
  );

  const countryCode = getCountryCodeFromName(nextRace.country);

  return (
    <div className={styles.nextSessionWrapper}>
      <div className={styles.nextSessionContent}>
        <div className={styles.infoGroup}>
          <div className={clsx(styles.infoGroupLabel, styles.raceDate)}>
            <span>{translate("roundShort", { number: nextRace.round })}</span>
            {" | "}
            <span> {formattedDate}</span>
          </div>
          <div className={clsx(styles.infoGroupBody, styles.raceName)}>
            {countryCode && <Flag countryCode={countryCode} />}

            <Link
              href={`/results/${nextEventYear}/races/${nextRace.circuitId}-${nextRace.round}`}
            >
              {nextRace.country} <ArrowRight width="1em" height="1em" />
            </Link>
          </div>
        </div>
        <div className={styles.infoGroup}>
          <div className={clsx(styles.infoGroupLabel, styles.raceSession)}>
            <span>{translate("nextSession")}: </span>
            <strong>{nextRace.nextSession.sessionName}</strong>
          </div>
          <div className={clsx(styles.infoGroupBody, styles.raceCountdown)}>
            <Countdown targetDate={nextRace.nextSession.iso} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextSessionCounter;
