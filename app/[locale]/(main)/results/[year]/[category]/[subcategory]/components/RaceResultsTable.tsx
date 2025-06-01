"use client";

import { Race, RaceResultRow } from "@/app/types/raceResults";
import ResultsTable, {
  DetailItem,
} from "../../../../components/ResultsTable/ResultsTable";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "./SubcategoryPageHandler";
import { formatDate } from "@/app/lib/date-utils";

interface RaceResultsTableProps {
  year: string;
  data: Race[] | undefined;
  detail?: RaceFetchResult;
}

const RaceResultsTable = ({ year, data, detail }: RaceResultsTableProps) => {
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

  const raceDate = data?.[0]?.date || detail?.Race?.date?.date;

  const raceInfo = [
    raceDate && formatDate(raceDate),
    data?.[0]?.Circuit.circuitName || detail?.circuitName,
  ]
    .filter(Boolean)
    .join(" - ");

  let detailsList: DetailItem[] = [];

  if (detail) {
    const availableDetails = (Object.keys(DETAILS) as (keyof typeof DETAILS)[])
      .map((session) => detail[session])
      .filter((session) => Boolean(session?.date));

    detailsList = [...availableDetails];
  }

  const raceDetails: DetailItem[] = [...detailsList].sort(
    (a, b) => b.order - a.order
  );

  return (
    <ResultsTable<RaceResultRow>
      caption={`${year} ${
        data?.[0]?.raceName || detail?.raceName || ""
      } Race Results`}
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
