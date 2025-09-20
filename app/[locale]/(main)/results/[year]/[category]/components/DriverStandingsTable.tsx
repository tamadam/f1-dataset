"use client";

import { DriverStandings } from "@/app/types/driverStandings";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";
import { createAnimation } from "@/app/lib/chart-utils";
import { teamColorMap } from "@/app/lib/maps/team-color-map";
import { RoundsList } from "./CategoryPageHandler";

interface DriverStandingsTableProps {
  year: string;
  data: DriverStandings[] | undefined;
  allRoundsData?: {
    dataArray: DriverStandings[][];
    roundsList: RoundsList;
  };
}

const buildGraphData = (
  year: string,
  driverStandingsRoundByRound: DriverStandings[][] | undefined,
  roundsList: RoundsList | undefined,
  roundLabel: string
) => {
  const totalRounds = roundsList?.length || 0;

  if (driverStandingsRoundByRound && driverStandingsRoundByRound.length > 0) {
    const paddedRounds = [
      ...driverStandingsRoundByRound,
      ...Array.from(
        { length: totalRounds - driverStandingsRoundByRound.length },
        () => []
      ),
    ];

    const labels = paddedRounds.map((_, index) => {
      const raceName = roundsList?.[index].roundName;
      if (raceName) {
        return `${index + 1}. ${raceName}`;
      } else {
        return roundLabel.replace("XXX", String(index + 1));
      }
    });

    const driversMap = new Map<
      string,
      { name: string; constructorId: string }
    >();

    driverStandingsRoundByRound.map((round) => {
      round.forEach((d) =>
        driversMap.set(d.Driver.driverId, {
          name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`,
          constructorId: d.Constructors[0].constructorId,
        })
      );
    });

    const latestRound =
      driverStandingsRoundByRound[driverStandingsRoundByRound.length - 1] || [];

    const drivers = Array.from(driversMap, ([id, { name, constructorId }]) => {
      const driverData = latestRound.find((d) => d.Driver.driverId === id);
      const points = driverData ? Number(driverData.points) : 0;
      return {
        id,
        name,
        constructorId,
        points,
      };
    }).sort((a, b) => b.points - a.points);

    const constructorDriverOrder: Record<string, number> = {};

    const datasets = drivers.map((driver) => {
      const constructorId = driver.constructorId;
      const teamColor =
        teamColorMap[year]?.[constructorId] ??
        `hsl(${Math.random() * 360},70%,50%)`;

      const driverIndex = constructorDriverOrder[constructorId] || 0;
      constructorDriverOrder[constructorId] = driverIndex + 1;

      const isSecondDriver = driverIndex >= 1; // 0 = first, 1 or more second driver
      const driverColor = isSecondDriver ? `${teamColor}80` : teamColor;

      return {
        label: driver.name,
        data: driverStandingsRoundByRound.map((round) => {
          const driverData = round.find((d) => d.Driver.driverId === driver.id);

          return driverData ? Number(driverData.points) : null;
        }),
        borderColor: driverColor,
        backgroundColor: teamColor,
        borderDash: isSecondDriver ? [6, 4] : undefined,
      };
    });

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
    year,
    allRoundsData?.dataArray,
    allRoundsData?.roundsList,
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
