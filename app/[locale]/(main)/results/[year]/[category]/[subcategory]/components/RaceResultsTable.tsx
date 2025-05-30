"use client";

import { Race, RaceResultRow } from "@/app/types/raceResults";
import ResultsTable from "../../../../components/ResultsTable/ResultsTable";
import { DETAILS } from "@/app/constants";

interface RaceResultsTableProps {
  year: string;
  data: Race[] | undefined;
}
const RaceResultsTable = ({ year, data }: RaceResultsTableProps) => {
  console.log(data);
  const rows: RaceResultRow[] = (data || []).flatMap((race) =>
    race.Results.map((res) => ({
      round: race.round,
      raceName: race.raceName,
      position: res.position,
      number: res.number,
      driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
      constructorName: res.Constructor.name,
      laps: res.laps,
      timeOrStatus: res.Time?.time ?? res.status,
      points: res.points,
    }))
  );

  const raceInfo = [data?.[0].date, data?.[0].Circuit.circuitName]
    .filter(Boolean)
    .join(" - ");

  const raceDetails = ["Race Result", ...DETAILS.map((detail) => detail)];
  console.log(raceDetails);
  return (
    <ResultsTable<RaceResultRow>
      caption={`${year} ${data?.[0]?.raceName || ""} Race Results`}
      captionDescription={raceInfo}
      noDataText="Results for this session aren't available yet"
      data={rows}
      detailList={raceDetails}
      columns={[
        { field: "position", header: "Pos", styles: { columnSize: "0.2fr" } },
        {
          field: "number",
          header: "NO",
          styles: { columnSize: "0.2fr" },
        },
        {
          field: "driverName",
          header: "Driver",
          styles: { columnSize: "1fr" },
        },
        {
          field: "constructorName",
          header: "Car",
          styles: { columnSize: "0.6fr" },
        },
        {
          field: "laps",
          header: "Laps",
          styles: { columnSize: "0.4fr", textAlign: "center" },
        },
        {
          field: "timeOrStatus",
          header: "Time/Retired",
          styles: { columnSize: "0.6fr", textAlign: "center" },
        },
        {
          field: "points",
          header: "Pts",
          styles: { columnSize: "0.2fr", textAlign: "right" },
        },
      ]}
    />
  );
};

export default RaceResultsTable;
