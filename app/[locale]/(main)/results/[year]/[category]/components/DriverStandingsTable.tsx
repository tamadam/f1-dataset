"use client";

import { DriverStandings } from "@/app/types/driverStandings";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";

interface DriverStandingsTableProps {
  year: string;
  data: DriverStandings[] | undefined;
}

const DriverStandingsTable = ({ year, data }: DriverStandingsTableProps) => {
  const translate = useTranslations("General");

  return (
    <ResultsTable<DriverStandings>
      caption={`${year} ${translate("driverStandings")}`}
      columns={[
        {
          field: "positionText",
          header: translate("pos"),
          styles: {
            columnSize: "1fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          urlHref: (value) =>
            `/results/${year}/drivers/${value.Driver.driverId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: translate("nationality"),
          renderCell: (value) => `${value.Driver.nationality}`,
          styles: {
            columnSize: "2fr",
            textAlign: "center",
          },
        },
        {
          field: "Constructors",
          header: translate("car"),
          renderCell: (value) => value.Constructors[0].name,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Constructors[0].constructorId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "center",
          },
        },
        {
          field: "points",
          header: translate("points"),
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

export default DriverStandingsTable;
