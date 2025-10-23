"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import styles from "./Countdown.module.scss";

interface CountdownProps {
  targetDate: string;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    new Date(targetDate).getTime() - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      setTimeLeft(distance);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const translation = useTranslations("General");

  if (timeLeft <= 0)
    return (
      <div className={styles.counter}>
        <span>{translation("ongoingSession")}</span>
      </div>
    );

  const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
  const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className={styles.counter}>
      <span className={styles.unit}>
        <strong className={styles.number}>
          {days.toString().padStart(2, "0")}
        </strong>
        <span className={styles.label}>{translation("day")}</span>
      </span>
      <span className={styles.unit}>
        <strong className={styles.number}>
          {hours.toString().padStart(2, "0")}
        </strong>
        <span className={styles.label}>{translation("hour")}</span>
      </span>

      <span className={styles.unit}>
        <strong className={styles.number}>
          {minutes.toString().padStart(2, "0")}
        </strong>
        <span className={styles.label}>{translation("minute")}</span>
      </span>
      <span className={styles.unit}>
        <strong className={styles.number}>
          {seconds.toString().padStart(2, "0")}
        </strong>
        <span className={styles.label}>{translation("second")}</span>
      </span>
    </div>
  );
};

export default Countdown;
