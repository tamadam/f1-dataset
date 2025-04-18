"use client";

import clsx from "clsx";
import { ArrowDown, Globe } from "../icons";
import styles from "./LanguageSelector.module.scss";
import { Locale, useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

interface LanguageSelectorProps {
  horizontalAlignment?: "left" | "center" | "right";
}

const LanguageSelector = ({
  horizontalAlignment = "center",
}: LanguageSelectorProps) => {
  const locale = useLocale();
  const translation = useTranslations("General");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const params = useParams();

  const localeLabels: Record<string, string> = {
    en: translation("languageSelector.languageEnglish"),
    hu: translation("languageSelector.languageHungarian"),
  };

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale }
      );
    });
  };

  return (
    <>
      {isPending && <div className={styles.pending} />}
      <div
        className={clsx(styles.languageSelectorOuterWrapper, {
          [styles.alignLeft]: horizontalAlignment === "left",
          [styles.alignCenter]: horizontalAlignment === "center",
          [styles.alignRight]: horizontalAlignment === "right",
        })}
      >
        <div className={styles.languageSelectorWrapper}>
          <div className={styles.languageSelectorIcon} aria-hidden>
            <Globe width={16} height={16} focusable={false} />
          </div>
          <select
            className={styles.languageSelector}
            defaultValue={locale}
            disabled={isPending}
            name="language-select"
            aria-label={translation("languageSelector.ariaLabel")}
            onChange={handleLocaleChange}
          >
            {routing.locales.map((currentLocale) => (
              <option key={currentLocale} value={currentLocale}>
                {localeLabels[currentLocale] || currentLocale}
              </option>
            ))}
          </select>
          <div className={styles.languageSelectorIcon} aria-hidden>
            <ArrowDown width={16} height={16} focusable={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageSelector;
