import { setRequestLocale } from "next-intl/server";
import YearSelector from "../components/YearSelector/YearSelector";
import { cacheLife } from "next/cache";

export default async function ResultsPageYearLayout({
  children,
  params,
}: LayoutProps<"/[locale]/results/[year]">) {
  "use cache";
  cacheLife("max");
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div style={{ background: "#f6f4f0" }}>
      <YearSelector />
      {children}
    </div>
  );
}
