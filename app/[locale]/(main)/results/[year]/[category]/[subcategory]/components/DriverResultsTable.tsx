"use client";

import ResultsTable from "@/app/[locale]/(main)/results/components/ResultsTable/ResultsTable";
import { DriverRace } from "@/app/types/driverResults";
import { useTranslations } from "next-intl";
import React from "react";

interface DriverResultsTableProps {
  year: string;
  data: DriverRace[] | undefined;
}

const DriverResultsTable = ({ year, data }: DriverResultsTableProps) => {
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
          renderCell: (value) => `${value.Circuit.circuitName}`,
          styles: {
            columnSize: "1.4fr",
            textAlign: "left",
          },
        },
        {
          field: "date",
          header: translate("date"),
          styles: {
            columnSize: "0.8fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: translate("car"),
          renderCell: (value) => `${value.Results[0].Constructor.name}`,
          styles: {
            columnSize: "1fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: translate("position"),
          renderCell: (value) => value.Results[0].position,
          styles: {
            columnSize: "0.6fr",
            textAlign: "center",
          },
        },
        {
          field: "Results",
          header: translate("points"),
          renderCell: (value) => `${value.Results[0].points}`,
          styles: {
            columnSize: "0.6fr",
            textAlign: "right",
          },
        },
      ]}
      data={data}
    />
  );
};

export default DriverResultsTable;
