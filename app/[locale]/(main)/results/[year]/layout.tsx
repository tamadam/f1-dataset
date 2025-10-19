import { setRequestLocale } from "next-intl/server";
import YearSelector from "../components/YearSelector/YearSelector";
import styles from "./layout.module.scss";

export default async function ResultsPageYearLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className={styles.resultsPageYearLayoutWrapper}>
      <YearSelector />
      {children}
    </div>
  );
}
