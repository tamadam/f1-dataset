"use client";

import ResultsTable from "@/app/[locale]/(main)/results/components/ResultsTable/ResultsTable";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { ConstructorRace } from "@/app/types/constructorResults";
import { useTranslations } from "next-intl";

interface ConstructorResultsTableProps {
  year: string;
  locale?: string;
  data: ConstructorRace[] | undefined;
}
const ConstructorResultsTable = ({
  year,
  locale,
  data,
}: ConstructorResultsTableProps) => {
  const translate = useTranslations("General");

  const constructor = data?.[0].Results[0].Constructor;

  return (
    <ResultsTable<ConstructorRace>
      caption={`${year} ${translate("constructorStandings")}: ${
        constructor?.name
      }`}
      columns={[
        {
          field: "Circuit",
          header: translate("grandPrix"),
          renderCell: (value) => `${value.raceName}`,
          urlHref: (value) =>
            `/results/${year}/races/${value.Circuit.circuitId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "left",
          },
        },
        {
          field: "date",
          header: translate("date"),
          renderCell: (value) =>
            formatDate(value.date, getValidLocaleForDate(locale)),
          styles: {
            columnSize: "1fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: translate("points"),
          renderCell: (value) =>
            `${value.Results.reduce((acc, currVal) => {
              const value = Number(currVal.points);
              return isNaN(value) ? acc + 0 : acc + value;
            }, 0)}`,
          styles: {
            columnSize: "1fr",
            textAlign: "right",
          },
        },
      ]}
      data={data}
    />
  );
};

export default ConstructorResultsTable;
