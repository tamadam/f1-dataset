"use client";

import { ConstructorStandings } from "@/app/types/constructorStandings";
import React from "react";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";

interface ConstructorStandingsTableProps {
  year: string;
  data: ConstructorStandings[] | undefined;
}

const ConstructorStandingsTable = ({
  year,
  data,
}: ConstructorStandingsTableProps) => {
  const translate = useTranslations("General");

  return (
    <ResultsTable<ConstructorStandings>
      caption={`${year} ${translate("constructorStandings")}`}
      columns={[
        {
          field: "positionText",
          header: translate("pos"),
          styles: {
            columnSize: "0.4fr",
            textAlign: "left",
          },
        },
        {
          field: "Constructor",
          header: translate("constructor"),
          renderCell: (value) => `${value.Constructor.name}`,
          styles: {
            columnSize: "3fr",
            textAlign: "left",
          },
        },
        {
          field: "points",
          header: translate("points"),
          styles: {
            columnSize: "1fr",
            textAlign: "center",
          },
        },
      ]}
      tableInlineStyles={{ minWidth: "350px" }}
      data={data}
    />
  );
};

export default ConstructorStandingsTable;
