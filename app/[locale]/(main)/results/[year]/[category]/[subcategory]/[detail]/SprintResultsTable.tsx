"use client";

import { SessionResults } from "@/app/types/f1Common";
import { RaceFetchResult } from "../components/SubcategoryPageHandler";
import ResultsTable, {
  DetailItem,
} from "../../../../components/ResultsTable/ResultsTable";
import { formatDate } from "@/app/lib/date-utils";
import { DETAILS } from "@/app/constants";

interface SprintResultsTableProps {
  year: string;
  data: SessionResults[] | undefined;
  detail?: RaceFetchResult;
}

const SprintResultsTable = ({
  year,
  data,
  detail,
}: SprintResultsTableProps) => {
  const raceDate = detail?.Race?.date?.date;

  const raceInfo = [raceDate && formatDate(raceDate), detail?.circuitName]
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
    <ResultsTable<SessionResults>
      caption={`${year} ${detail?.raceName || ""} Sprint Race Results`}
      captionDescription={raceInfo}
      noDataText="Results for this session aren't available yet"
      data={data}
      detailList={raceDetails}
      columns={[
        { field: "position", header: "Pos", styles: { columnSize: "0.2fr" } },
        {
          field: "number",
          header: "NO",
          styles: { columnSize: "0.2fr" },
        },
        {
          field: "Driver",
          header: "Driver",
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          styles: { columnSize: "1fr" },
        },
        {
          field: "Constructor",
          header: "Constructor",
          renderCell: (value) => `${value.Constructor.name}`,
          styles: { columnSize: "0.6fr" },
        },
        {
          field: "laps",
          header: "Laps",
          styles: { columnSize: "0.4fr", textAlign: "center" },
        },
        {
          field: "Time",
          header: "Time/Retired",
          renderCell: (value) =>
            value.Time ? value.Time.time : `Retired: ${value.status}`,
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

export default SprintResultsTable;
