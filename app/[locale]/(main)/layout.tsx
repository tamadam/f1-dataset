import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
/* import NextSessionCounterWrapper from "@/app/components/NextSessionCounter/NextSessionCounterWrapper";
 */ import { setRequestLocale } from "next-intl/server";

export default async function MainPageLayout({
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
    <>
      <HeaderFull />
      {/* <NextSessionCounterWrapper locale={locale} /> */}
      <div>{children}</div>
    </>
  );
}
