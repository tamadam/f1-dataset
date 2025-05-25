import { Race } from "@/app/types/races";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";

interface RacesTableProps {
  year: string;
  data: Race[] | undefined;
}
const RacesTable = ({ year, data }: RacesTableProps) => {
  return (
    <ResultsTable<Race>
      caption={`${year} Races`}
      columns={[
        {
          field: "round",
          header: "Round",
          styles: { columnSize: "0.4fr" },
        },
        {
          field: "raceName",
          header: "Grand Prix",
        },
        {
          field: "date",
          header: "Date",
          styles: { textAlign: "center" },
        },
      ]}
      data={data}
    />
  );
};

export default RacesTable;
