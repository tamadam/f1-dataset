"use client";

import ResultsTable from "@/app/[locale]/(main)/results/components/ResultsTable/ResultsTable";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { DriverRace } from "@/app/types/driverResults";
import { useTranslations } from "next-intl";
import React from "react";

interface DriverResultsTableProps {
  year: string;
  locale?: string;
  data: DriverRace[] | undefined;
}

const DriverResultsTable = ({
  year,
  locale,
  data,
}: DriverResultsTableProps) => {
  const translate = useTranslations("General");

  const driver = data?.[0].Results[0].Driver;

  return (
    <ResultsTable<DriverRace>
      caption={`${year} ${translate("driverStandings")}: ${driver?.givenName} ${
        driver?.familyName
      }`}
      columns={[
        {
          field: "Circuit",
          header: translate("grandPrix"),
          renderCell: (value) => `${value.raceName}`,
          urlHref: (value) =>
            `/results/${year}/races/${value.Circuit.circuitId}-${value.round}`,
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
            columnSize: "2fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: translate("car"),
          renderCell: (value) => `${value.Results[0].Constructor.name}`,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Results[0].Constructor.constructorId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: translate("position"),
          renderCell: (value) => value.Results[0].position,
          styles: {
            columnSize: "1fr",
            textAlign: "center",
          },
        },
        {
          field: "Results",
          header: translate("points"),
          renderCell: (value) => `${value.Results[0].points}`,
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

export default DriverResultsTable;
