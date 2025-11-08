"use client";

import { QualifyingResult } from "@/app/types/qualifyingResults";
import ResultsTable, {
  DetailItem,
} from "../../../../../components/ResultsTable/ResultsTable";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { DETAILS } from "@/app/constants";
import { RaceFetchResult } from "../../components/SubcategoryPageHandler";
import { useTranslations } from "next-intl";
import { getCountryCodeFromName } from "@/app/lib/country-utils";
import Flag from "@/app/components/Flag/Flag";
import { DateTime } from "@/app/types/f1Common";

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
    <ResultsTable<QualifyingResult>
      caption={`${year} ${detail?.raceName || ""} ${translate(
        "qualifyingResults"
      )}`}
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
          styles: { columnSize: "0.2fr" },
        },
        {
          field: "Driver",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          urlHref: (value) =>
            `/results/${year}/drivers/${value.Driver.driverId}`,
        },
        {
          field: "Constructor",
          header: translate("constructor"),
          renderCell: (value) => `${value.Constructor.name}`,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Constructor.constructorId}`,
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
