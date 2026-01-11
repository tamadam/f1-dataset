"use client";

import { Race, RaceResultRow } from "@/app/types/raceResults";
import ResultsTable, {
  DetailItem,
} from "../../../../components/ResultsTable/ResultsTable";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "./SubcategoryPageHandler";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { useTranslations } from "next-intl";
import { getCountryCodeFromName } from "@/app/lib/country-utils";
import Flag from "@/app/components/Flag/Flag";
import { DateTime } from "@/app/types/f1Common";

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
      driverId: res.Driver.driverId,
      constructorName: res.Constructor.name,
      constructorId: res.Constructor.constructorId,
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

  const raceDetails: DetailItem[] = [...detailsList].sort((a, b) => {
    const getDateTime = (dateTime: DateTime) => {
      const time = dateTime.time ?? "00:00:00Z";
      return new Date(`${dateTime.date}T${time}`);
    };

    if (!(a.date && b.date)) return b.order - a.order;

    const dateA = getDateTime(a.date).getTime();
    const dateB = getDateTime(b.date).getTime();

    // The API omits time for practice and qualifying sessions,
    // so we sort same-day sessions using the custom `order` value.
    if (dateA === dateB) {
      return b.order - a.order;
    }

    return dateB - dateA;
  });

  const rawCountry =
    data?.[0]?.Circuit?.Location.country || detail?.country || "";
  const countryCode = getCountryCodeFromName(rawCountry);

  return (
    <ResultsTable<RaceResultRow>
      caption={`${year} ${
        data?.[0]?.raceName || detail?.raceName || ""
      } ${translate("results")}`}
      captionDescription={
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>{raceInfo}</span>
          {countryCode && <Flag countryCode={countryCode} />}
        </div>
      }
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
          urlHref: (value) => `/results/${year}/drivers/${value.driverId}`,
          header: translate("driver"),
          styles: { columnSize: "3fr" },
        },
        {
          field: "constructorName",
          urlHref: (value) =>
            `/results/${year}/constructors/${value.constructorId}`,
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
