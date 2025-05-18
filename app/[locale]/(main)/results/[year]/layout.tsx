import YearSelector from "../components/YearSelector/YearSelector";
import styles from "./layout.module.scss";

export default async function ResultsPageYearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.resultsPageYearLayoutWrapper}>
      <YearSelector />
      {children}
    </div>
  );
}
