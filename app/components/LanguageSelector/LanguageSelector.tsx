"use client";

import { ArrowDown, Globe } from "../icons";
import styles from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  return (
    <div className={styles.languageSelectorWrapper}>
      <div className={styles.languageSelectorIcon} aria-hidden>
        <Globe width={16} height={16} focusable={false} />
      </div>
      <select
        className={styles.languageSelector}
        name="language-select"
        aria-label="Choose language"
      >
        <option value="hu">Magyar</option>
        <option value="en">English</option>
      </select>
      <div className={styles.languageSelectorIcon} aria-hidden>
        <ArrowDown width={16} height={16} focusable={false} />
      </div>
    </div>
  );
};

export default LanguageSelector;
