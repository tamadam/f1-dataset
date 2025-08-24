import {
  CategoryKey,
  getCategory,
  getCategoryData,
} from "./components/CategoryPageHandler";
import styles from "./layout.module.scss";
import SelectorCard from "../../components/Selector/SelectorCard";
import { CATEGORIES } from "@/app/constants";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ResultsPageCategoryLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string; category: CategoryKey }>;
}>) {
  const { year, category } = await params;
  if (isNaN(Number(year)) || !CATEGORIES.includes(category as CategoryKey))
    return notFound();

  const translate = await getTranslations("General");

  const handler = getCategory(category);
  const rawData = await getCategoryData(handler, year);
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
