import HeaderSimple from "@/app/components/Header/HeaderSimple/HeaderSimple";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translation = await getTranslations({
    locale,
    namespace: "LandingPage",
  });

  return {
    title: translation("metadata.title"),
    description: translation("metadata.description"),
  };
}

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderSimple />
      <main>{children}</main>
    </>
  );
}
