"use client";

import { FastestLapRace } from "@/app/types/fastestLaps";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";

interface FastestLapsTableProps {
  year: string;
  data: FastestLapRace[] | undefined;
}
const FastestLapsTable = ({ year, data }: FastestLapsTableProps) => {
  return (
    <ResultsTable<FastestLapRace>
      caption={`${year} Fastest Laps`}
      columns={[
        {
          field: "raceName",
          header: "Grand Prix",
        },
        {
          field: "Results",
          header: "Driver",
          renderCell: (value) =>
            `${value.Results[0].Driver.givenName} ${value.Results[0].Driver.familyName}`,
        },
        {
          field: "Results",
          header: "Car",
          renderCell: (value) => `${value.Results[0].Constructor.name}`,
        },
        {
          field: "Results",
          header: "Time",
          renderCell: (value) => value.Results[0].FastestLap.Time.time,
        },
      ]}
      data={data}
    />
  );
};

export default FastestLapsTable;
