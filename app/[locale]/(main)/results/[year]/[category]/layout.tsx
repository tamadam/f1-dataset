import {
  CategoryKey,
  getCategoryHandler,
  getCategoryDataCached,
} from "./components/CategoryPageHandler";
import styles from "./layout.module.scss";
import SelectorCard from "../../components/Selector/SelectorCard";
import { CATEGORIES } from "@/app/constants";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isValidF1Year } from "@/app/lib/year-utils";

export default async function ResultsPageCategoryLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string; category: string }>;
}>) {
  const { locale, year, category } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const isValidYear = isValidF1Year(year);

  if (!isValidYear || !CATEGORIES.includes(category as CategoryKey))
    return notFound();

  const translate = await getTranslations("General");

  const handler = getCategoryHandler(category as CategoryKey);
  const rawData = await getCategoryDataCached(handler, year);
  if (!rawData) return notFound();

  const data = handler.extract(rawData.data);
  const elements = handler.selectorMap ? data.map(handler.selectorMap) : [];

  const categories = CATEGORIES.map((category) => ({
    id: category,
    name: translate(category),
  }));

  return (
    <>
      <div className={styles.categoryLayoutPageWrapper}>
        <div className={styles.categoryLayoutSelectorWrapper}>
          <SelectorCard
            elements={categories}
            urlKey="category"
            title={translate("category")}
            backgroundType="car"
          />

          {elements.length > 0 && (
            <SelectorCard
              elements={elements}
              urlKey="subcategory"
              title={translate("results")}
              includeAllOption
            />
          )}
        </div>
        {children}
      </div>
    </>
  );
}
