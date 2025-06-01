"use client";

import { Race, RaceResultRow } from "@/app/types/raceResults";
import ResultsTable, {
  DetailItem,
} from "../../../../components/ResultsTable/ResultsTable";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "./SubcategoryPageHandler";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { useTranslations } from "next-intl";

interface RaceResultsTableProps {
  year: string;
  locale?: string;
  data: Race[] | undefined;
  detail?: RaceFetchResult;
}

const RaceResultsTable = ({
  year,
  locale,
  data,
  detail,
}: RaceResultsTableProps) => {
  const translate = useTranslations("General");

  const rows: RaceResultRow[] = (data || []).flatMap((race) =>
    race.Results.map((res) => ({
      round: race.round,
      raceName: race.raceName,
      position: res.position,
      number: res.number,
      driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
      constructorName: res.Constructor.name,
      laps: res.laps,
      timeOrStatus: res.Time
        ? res.Time.time
        : res.positionText === "R"
        ? "Retired"
        : res.status,
      points: res.points,
    }))
  );

  const raceDate = data?.[0]?.date || detail?.Race?.date?.date;

  const raceInfo = [
    raceDate && formatDate(raceDate, getValidLocaleForDate(locale)),
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
      } ${translate("results")}`}
      captionDescription={raceInfo}
      noDataText={translate("noResults")}
      data={rows}
      detailList={raceDetails}
      columns={[
        {
          field: "position",
          header: translate("pos"),
          styles: { columnSize: "1fr" },
        },
        {
          field: "number",
          header: "NO",
          styles: { columnSize: "1fr" },
        },
        {
          field: "driverName",
          header: translate("driver"),
          styles: { columnSize: "3fr" },
        },
        {
          field: "constructorName",
          header: translate("car"),
          styles: { columnSize: "3fr" },
        },
        {
          field: "laps",
          header: translate("laps"),
          styles: { columnSize: "2fr", textAlign: "center" },
        },
        {
          field: "timeOrStatus",
          header: translate("time-retired"),
          styles: { columnSize: "2fr", textAlign: "center" },
        },
        {
          field: "points",
          header: translate("points"),
          styles: { columnSize: "2fr", textAlign: "right" },
        },
      ]}
    />
  );
};

export default RaceResultsTable;
