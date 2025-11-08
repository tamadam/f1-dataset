"use client";

import { DateTime, SessionResults } from "@/app/types/f1Common";
import { RaceFetchResult } from "../../components/SubcategoryPageHandler";
import ResultsTable, {
  DetailItem,
} from "../../../../../components/ResultsTable/ResultsTable";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { DETAILS } from "@/app/constants";
import { useTranslations } from "next-intl";
import { getCountryCodeFromName } from "@/app/lib/country-utils";
import Flag from "@/app/components/Flag/Flag";

interface SprintResultsTableProps {
  year: string;
  locale?: string;
  data: SessionResults[] | undefined;
  detail?: RaceFetchResult;
}

const SprintResultsTable = ({
  year,
  locale,
  data,
  detail,
}: SprintResultsTableProps) => {
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

  const raceDetails: DetailItem[] = [...detailsList].sort((a, b) => {
    const getDateTime = (dateTime: DateTime) => {
      const time = dateTime.time ?? "00:00:00Z";
      return new Date(`${dateTime.date}T${time}`);
    };

    if (!(a.date && b.date)) return b.order - a.order;

    const dateA = getDateTime(a.date).getTime();
    const dateB = getDateTime(b.date).getTime();

    return dateB - dateA;
  });

  const countryCode = getCountryCodeFromName(detail?.country || "");

  return (
    <ResultsTable<SessionResults>
      caption={`${year} ${detail?.raceName || ""} ${translate("sprint")}`}
      captionDescription={
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>{raceInfo}</span>
          {countryCode && <Flag countryCode={countryCode} />}
        </div>
      }
      noDataText={translate("noResults")}
      data={data}
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
          field: "Driver",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          urlHref: (value) =>
            `/results/${year}/drivers/${value.Driver.driverId}`,
          styles: { columnSize: "3fr" },
        },
        {
          field: "Constructor",
          header: translate("constructor"),
          renderCell: (value) => `${value.Constructor.name}`,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Constructor.constructorId}`,
          styles: { columnSize: "3fr" },
        },
        {
          field: "laps",
          header: translate("laps"),
          styles: { columnSize: "2fr", textAlign: "center" },
        },
        {
          field: "Time",
          header: translate("time-retired"),
          renderCell: (value) =>
            value?.Time?.time
              ? value.Time.time
              : value.positionText === "R"
              ? "Retired"
              : `${value.status}`,
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

export default SprintResultsTable;
