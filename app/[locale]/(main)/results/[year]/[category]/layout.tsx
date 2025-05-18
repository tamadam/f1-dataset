import { CategoryKey, getCategory } from "./components/CategoryPageHandler";
import styles from "./layout.module.scss";
import SelectorCard from "../../components/Selector/SelectorCard";
import { CATEGORIES } from "@/app/constants";

export default async function ResultsPageCategoryLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string; category: CategoryKey }>;
}>) {
  const { year, category } = await params;
  const handler = getCategory(category);
  const rawData = await handler.fetch(year);
  const data = handler.extract(rawData);
  const elements = data.map(handler.selectorMap);

  const categories = [
    ...CATEGORIES.map((category) => category),
    "fastest-laps",
    "races",
  ];

  return (
    <>
      <div className={styles.categoryLayoutPageWrapper}>
        <div className={styles.categoryLayoutSelectorWrapper}>
          <SelectorCard
            elements={categories}
            urlKey="category"
            title="Category"
            backgroundType="car"
          />

          <SelectorCard
            elements={elements}
            urlKey="subcategory"
            title="Results"
            includeAllOption
          />
        </div>
        {children}
      </div>
    </>
  );
}
