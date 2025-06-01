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
        },
        {
          field: "Results",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Results[0].Driver.givenName} ${value.Results[0].Driver.familyName}`,
        },
        {
          field: "Results",
          header: translate("car"),
          renderCell: (value) => `${value.Results[0].Constructor.name}`,
        },
        {
          field: "Results",
          header: translate("time"),
          renderCell: (value) => value.Results[0].FastestLap.Time.time,
        },
      ]}
      data={data}
    />
  );
};

export default FastestLapsTable;
