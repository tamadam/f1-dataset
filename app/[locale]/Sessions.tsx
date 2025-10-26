import { getCurrentYear } from "@/app/lib/year-utils";
import { getAllRaces } from "@/app/lib/api/getAllRaces";
import NextSessionCounter from "@/app/components/NextSessionCounter/NextSessionCounter";
import { Race, RawRaces } from "@/app/types/races";

const Sessions = async () => {
  const currentYear: number = getCurrentYear();
  const rawAllRaces: RawRaces | null = await getAllRaces(String(currentYear));
  const allRacesList: Race[] = rawAllRaces?.MRData.RaceTable.Races || [];
  return (
    <div>
      <NextSessionCounter races={allRacesList} locale={"en"} />
    </div>
  );
};

export default Sessions;
