"use client";

import { Race } from "@/app/types/races";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";
import { formatDate } from "@/app/lib/date-utils";

interface RacesTableProps {
  year: string;
  data: Race[] | undefined;
}
const RacesTable = ({ year, data }: RacesTableProps) => {
  const translate = useTranslations("General");

  return (
    <ResultsTable<Race>
      caption={`${year} ${translate("races")}`}
      columns={[
        {
          field: "round",
          header: translate("round"),
          styles: { columnSize: "0.4fr" },
        },
        {
          field: "raceName",
          header: translate("grandPrix"),
        },
        {
          field: "date",
          header: translate("date"),
          renderCell: (value) => formatDate(value.date),
          styles: { textAlign: "center" },
        },
      ]}
      data={data}
    />
  );
};

export default RacesTable;
