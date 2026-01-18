import { setRequestLocale } from "next-intl/server";
import styles from "./layout.module.scss";

export default async function StatisticsPageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className={styles.statisticsPageLayoutOuterWrapper}>
      <div className={styles.statisticsPageLayoutInnerWrapper}>{children}</div>
    </div>
  );
}
