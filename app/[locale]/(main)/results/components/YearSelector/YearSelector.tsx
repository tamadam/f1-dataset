import React from "react";
import Selector from "../Selector/Selector";
import { getAllF1YearsReverse } from "@/app/lib/year-utils";
import styles from "./YearSelector.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";

const YearSelector = () => {
  const elements = getAllF1YearsReverse();
  const translate = useTranslations("General");

  return (
    <div className={styles.yearSelectorWrapper}>
      <div className={styles.selectorBackground}>
        <Image
          src="/images/all-time-drivers.avif"
          fill
          alt="F1 Dataset Logo"
          className={styles.backgroundItem}
          fetchPriority="high"
          priority
        />
        <div className={styles.selectorContent}>
          <div className={styles.selectorTitle}>
            <span>{translate("season")}</span>
          </div>
          <div className={styles.selectorItems}>
            <Selector
              elements={elements}
              urlKey="year"
              styleOptions={{ highlightSelectedItem: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearSelector;
