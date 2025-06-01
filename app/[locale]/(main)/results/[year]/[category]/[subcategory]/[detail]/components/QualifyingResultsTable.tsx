"use client";

import { QualifyingResult } from "@/app/types/qualifyingResults";
import ResultsTable, {
  DetailItem,
} from "../../../../../components/ResultsTable/ResultsTable";
import { formatDate } from "@/app/lib/date-utils";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "../../components/SubcategoryPageHandler";

interface QualifyingResultsTableProps {
  year: string;
  data: QualifyingResult[] | undefined;
  detail?: RaceFetchResult;
}

const QualifyingResultsTable = ({
  year,
  data,
  detail,
}: QualifyingResultsTableProps) => {
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
    <ResultsTable<QualifyingResult>
      caption={`${year} ${detail?.raceName || ""} Qualifying Results`}
      captionDescription={raceInfo}
      noDataText="Results for this session aren't available yet"
      data={data}
      detailList={raceDetails}
      columns={[
        { field: "position", header: "Pos", styles: { columnSize: "0.2fr" } },
        {
          field: "Driver",
          header: "Driver",
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
        },
        {
          field: "Constructor",
          header: "Constructor",
          renderCell: (value) => `${value.Constructor.name}`,
        },
        {
          field: "Q1",
          header: "Q1",
          renderCell: (value) => `${value.Q1 || ""}`,
        },
        {
          field: "Q2",
          header: "Q2",
          renderCell: (value) => `${value.Q2 || ""}`,
        },
        {
          field: "Q3",
          header: "Q3",
          renderCell: (value) => `${value.Q3 || ""}`,
        },
      ]}
    />
  );
};

export default QualifyingResultsTable;
