import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import styles from "./layout.module.scss";

/*TODO: generateMetadata*/

export default async function MainPageLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  resultsDetail: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { year } = await params;

  return (
    <>
      <HeaderFull />
      <main className={styles.main}>
        <div className={styles.mainContentWrapper}>{children}</div>
      </main>
    </>
  );
}
