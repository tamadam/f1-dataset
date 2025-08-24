"use client";

import { DriverStandings } from "@/app/types/driverStandings";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";
import { createAnimation } from "@/app/lib/chart-utils";

interface DriverStandingsTableProps {
  year: string;
  data: DriverStandings[] | undefined;
  allRoundsData?: {
    dataArray?: DriverStandings[][];
    totalRounds?: number;
  };
}

const buildGraphData = (
  allRoundsData: DriverStandings[][] | undefined,
  totalRounds: number | undefined,
  roundLabel: string
) => {
  if (allRoundsData && allRoundsData.length > 0 && totalRounds) {
    const paddedRounds = [
      ...allRoundsData,
      ...Array.from({ length: totalRounds - allRoundsData.length }, () => []),
    ];

    const labels = paddedRounds.map((_, index) =>
      roundLabel.replace("XXX", String(index + 1))
    );

    const driversMap = new Map<string, string>();

    allRoundsData.map((round) => {
      round.forEach((d) =>
        driversMap.set(
          d.Driver.driverId,
          `${d.Driver.givenName[0]}. ${d.Driver.familyName}`
        )
      );
    });

    const drivers = Array.from(driversMap, ([id, name]) => ({
      id,
      name,
    }));

    const datasets = drivers.map((driver) => ({
      label: driver.name,
      data: allRoundsData.map((round) => {
        const driverData = round.find((d) => d.Driver.driverId === driver.id);
        return driverData ? Number(driverData.points) : null;
      }),
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    return { labels, datasets };
  }

  return { labels: [], datasets: [] };
};

const DriverStandingsTable = ({
  year,
  data,
  allRoundsData,
}: DriverStandingsTableProps) => {
  const translate = useTranslations("General");

  const graphData = buildGraphData(
    allRoundsData?.dataArray,
    allRoundsData?.totalRounds,
    translate("grandPrixWithNumber", { number: "XXX" })
  );

  const animation = createAnimation(graphData, 400);

  const chartData = {
    data: graphData,
    options: {
      responsive: true,
      animation,
      plugins: {
        title: {
          display: true,
          text: translate("driverStandingsRoundByRound", { year }),
          align: "start",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  };

  return (
    <ResultsTable<DriverStandings>
      caption={`${year} ${translate("driverStandings")}`}
      columns={[
        {
          field: "positionText",
          header: translate("pos"),
          styles: {
            columnSize: "1fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: translate("driver"),
          renderCell: (value) =>
            `${value.Driver.givenName} ${value.Driver.familyName}`,
          urlHref: (value) =>
            `/results/${year}/drivers/${value.Driver.driverId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "left",
          },
        },
        {
          field: "Driver",
          header: translate("nationality"),
          renderCell: (value) => `${value.Driver.nationality}`,
          styles: {
            columnSize: "2fr",
            textAlign: "center",
          },
        },
        {
          field: "Constructors",
          header: translate("car"),
          renderCell: (value) => value.Constructors[0].name,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Constructors[0].constructorId}`,
          styles: {
            columnSize: "2fr",
            textAlign: "center",
          },
        },
        {
          field: "points",
          header: translate("points"),
          styles: {
            columnSize: "1fr",
            textAlign: "right",
          },
        },
      ]}
      data={data}
      chartData={chartData}
    />
  );
};

export default DriverStandingsTable;
