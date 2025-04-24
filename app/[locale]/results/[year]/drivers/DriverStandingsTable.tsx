"use client";

import { DriverStanding } from "@/app/types/driverStandings";
import ResultsTable from "../../components/ResultsTable/ResultsTable";

interface DriverStandingsTableProps {
  year: string;
  data: DriverStanding[] | undefined;
}

const DriverStandingsTable = ({ year, data }: DriverStandingsTableProps) => {
  return (
    <ResultsTable<DriverStanding>
      caption={`${year} Driver Standings`}
      columns={[
        {
          field: "positionText",
          header: "Pos",
          styles: {
            columnSize: "0.4fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: "Driver",
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          styles: {
            columnSize: "1fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: "Nationality",
          renderCell: (value) => `${value.Driver.nationality}`,
          styles: {
            columnSize: "1fr",
            textAlign: "center",
          },
        },
        {
          field: "Constructors",
          header: "Car",
          renderCell: (value) => value.Constructors[0].name,
          styles: {
            columnSize: "1fr",
            textAlign: "center",
          },
        },
        {
          field: "points",
          header: "Points",
          styles: {
            columnSize: "0.4fr",
            textAlign: "right",
          },
        },
      ]}
      data={data}
    />
  );
};

export default DriverStandingsTable;
