"use client";

import { QualifyingResult } from "@/app/types/qualifyingResults";
import ResultsTable, {
  DetailItem,
} from "../../../../../components/ResultsTable/ResultsTable";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "../../components/SubcategoryPageHandler";
import { useTranslations } from "next-intl";

interface QualifyingResultsTableProps {
  year: string;
  locale?: string;
  data: QualifyingResult[] | undefined;
  detail?: RaceFetchResult;
}

const QualifyingResultsTable = ({
  year,
  locale,
  data,
  detail,
}: QualifyingResultsTableProps) => {
  const translate = useTranslations("General");

  const raceDate = detail?.Race?.date?.date;

  const raceInfo = [
    raceDate && formatDate(raceDate, getValidLocaleForDate(locale)),
    detail?.circuitName,
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
    <ResultsTable<QualifyingResult>
      caption={`${year} ${detail?.raceName || ""} ${translate(
        "qualifyingResults"
      )}`}
      captionDescription={raceInfo}
      noDataText={translate("noResults")}
      data={data}
      detailList={raceDetails}
      columns={[
        {
          field: "position",
          header: translate("pos"),
          styles: { columnSize: "0.2fr" },
        },
        {
          field: "Driver",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
        },
        {
          field: "Constructor",
          header: translate("constructor"),
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
