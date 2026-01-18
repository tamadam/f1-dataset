"use client";

import { Driver } from "@/app/types/f1Common";
import ResultsTable from "../../../results/components/ResultsTable/ResultsTable";
import styles from "./SearchTable.module.scss";
import { useTranslations } from "next-intl";

interface DriverSearchTableProps {
  drivers: Driver[];
  searchPlaceholder?: string;
}

const DriverSearchTable = ({
  drivers,
  searchPlaceholder = "",
}: DriverSearchTableProps) => {
  const translate = useTranslations("StatisticsPage");

  return (
    <div className={styles.searchTableWrapper}>
      <ResultsTable<Driver>
        caption={translate("statisticsDriverTableTitle")}
        captionDescription={translate("statisticsDriverTableDescription")}
        data={drivers}
        enableSearch
        searchableFields={["givenName", "familyName"]}
        searchPlaceholder={searchPlaceholder}
        columns={[
          {
            field: "givenName",
            header: "Driver Name",
            renderCell: (driver) => `${driver.givenName} ${driver.familyName}`,
            urlHref: (driver) => `/statistics/driver/${driver.driverId}`,
            styles: { columnSize: "2fr" },
          },
          {
            field: "nationality",
            header: "Nationality",
            styles: { textAlign: "center" },
          },
        ]}
        getRowKey={(driver) => driver.driverId}
      />
    </div>
  );
};

export default DriverSearchTable;
