import HeaderFull from "@/app/components/Header/HeaderFull/HeaderFull";
import YearSelector from "../components/YearSelector/YearSelector";

/*TODO: generateMetadata*/

export default async function LandingPageLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}>) {
  const { year } = await params;

  return (
    <>
      <HeaderFull />
      <YearSelector selectedYear={year} />
      <main>{children}</main>
    </>
  );
}
