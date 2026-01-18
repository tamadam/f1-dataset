"use client";

import { Constructor } from "@/app/types/f1Common";
import ResultsTable from "../../../results/components/ResultsTable/ResultsTable";
import styles from "./SearchTable.module.scss";
import { useTranslations } from "next-intl";

interface ConstructorSearchTableProps {
  constructors: Constructor[];
  searchPlaceholder?: string;
}

const ConstructorSearchTable = ({
  constructors,
  searchPlaceholder = "",
}: ConstructorSearchTableProps) => {
  const translate = useTranslations("StatisticsPage");

  return (
    <div className={styles.searchTableWrapper}>
      <ResultsTable<Constructor>
        caption={translate("statisticsConstructorTableTitle")}
        captionDescription={translate("statisticsConstructorTableDescription")}
        data={constructors}
        enableSearch
        searchableFields={["name"]}
        searchPlaceholder={searchPlaceholder}
        columns={[
          {
            field: "name",
            header: "Constructor Name",
            urlHref: (constructor) =>
              `/statistics/constructor/${constructor.constructorId}`,
            styles: { columnSize: "2fr" },
          },
          {
            field: "nationality",
            header: "Nationality",
            styles: { textAlign: "center" },
          },
        ]}
        getRowKey={(constructor) => constructor.constructorId}
      />
    </div>
  );
};

export default ConstructorSearchTable;
