"use client";

import { ArrowDown, Globe } from "../icons";
import styles from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  return (
    <div className={styles.languageSelectorWrapper}>
      <div className={styles.languageSelectorIcon}>
        <Globe width={16} height={16} />
      </div>
      <select className={styles.languageSelector} name="language-select">
        <option value="hu">Magyar</option>
        <option value="en">English</option>
      </select>
      <div className={styles.languageSelectorIcon}>
        <ArrowDown width={16} height={16} />
      </div>
    </div>
  );
};

export default LanguageSelector;
