"use client";

import { ConstructorStandings } from "@/app/types/constructorStandings";
import React from "react";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";

interface ConstructorStandingsTableProps {
  year: string;
  data: ConstructorStandings[] | undefined;
}

const ConstructorStandingsTable = ({
  year,
  data,
}: ConstructorStandingsTableProps) => {
  return (
    <ResultsTable<ConstructorStandings>
      caption={`${year} Constructor Standings`}
      columns={[
        {
          field: "positionText",
          header: "Pos",
          styles: {
            columnSize: "0.4fr",
            textAlign: "left",
          },
        },
        {
          field: "Constructor",
          header: "Team",
          renderCell: (value) => `${value.Constructor.name}`,
          styles: {
            columnSize: "3fr",
            textAlign: "left",
          },
        },
        {
          field: "points",
          header: "Points",

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
