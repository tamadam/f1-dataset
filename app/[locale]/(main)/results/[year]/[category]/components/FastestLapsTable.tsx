"use client";

import { FastestLapRace } from "@/app/types/fastestLaps";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";

interface FastestLapsTableProps {
  year: string;
  data: FastestLapRace[] | undefined;
}
const FastestLapsTable = ({ year, data }: FastestLapsTableProps) => {
  const translate = useTranslations("General");

  return (
    <ResultsTable<FastestLapRace>
      caption={`${year} ${translate("fastest-laps")}`}
      columns={[
        {
          field: "raceName",
          header: translate("grandPrix"),
          urlHref: (value) =>
            `/results/${year}/races/${value.Circuit.circuitId}`,
        },
        {
          field: "Results",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Results[0].Driver.givenName} ${value.Results[0].Driver.familyName}`,
          urlHref: (value) =>
            `/results/${year}/drivers/${value.Results[0].Driver.driverId}`,
        },
        {
          field: "Results",
          header: translate("car"),
          renderCell: (value) => `${value.Results[0].Constructor.name}`,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Results[0].Constructor.constructorId}`,
          styles: { textAlign: "center" },
        },
        {
          field: "Results",
          header: translate("time"),
          renderCell: (value) => value.Results[0].FastestLap.Time.time,
          styles: { textAlign: "right" },
        },
      ]}
      data={data}
    />
  );
};

export default FastestLapsTable;
