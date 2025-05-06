"use client";

import ResultsTable from "@/app/[locale]/(main)/results/components/ResultsTable/ResultsTable";
import { ConstructorRace } from "@/app/types/constructorResults";

interface ConstructorResultsTableProps {
  year: string;
  data: ConstructorRace[] | undefined;
}
const ConstructorResultsTable = ({
  year,
  data,
}: ConstructorResultsTableProps) => {
  console.log(data);
  const constructor = data?.[0].Results[0].Constructor;

  return (
    <ResultsTable<ConstructorRace>
      caption={`${year} Constructor Standings: ${constructor?.name}`}
      columns={[
        {
          field: "Circuit",
          header: "Grand prix",
          renderCell: (value) => `${value.Circuit.circuitName}`,
          styles: {
            columnSize: "1.4fr",
            textAlign: "left",
          },
        },
        {
          field: "date",
          header: "Date",
          styles: {
            columnSize: "0.8fr",
            textAlign: "left",
          },
        },
        {
          field: "Results",
          header: "Points",
          renderCell: (value) =>
            `${value.Results.reduce((acc, currVal) => {
              const value = Number(currVal.points);
              return isNaN(value) ? acc + 0 : acc + value;
            }, 0)}`,
          styles: {
            columnSize: "0.6fr",
            textAlign: "right",
          },
        },
      ]}
      data={data}
    />
  );
};

export default ConstructorResultsTable;
