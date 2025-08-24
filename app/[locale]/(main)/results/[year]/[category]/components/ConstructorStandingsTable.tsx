"use client";

import { ConstructorStandings } from "@/app/types/constructorStandings";
import React from "react";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { useTranslations } from "next-intl";
import { createAnimation } from "@/app/lib/chart-utils";
import { Link } from "@/i18n/navigation";
import { teamColorMap } from "@/app/lib/maps/team-color-map";

interface ConstructorStandingsTableProps {
  year: string;
  data: ConstructorStandings[];
  allRoundsData?: {
    dataArray?: ConstructorStandings[][];
    totalRounds?: number;
  };
}

const buildGraphData = (
  year: string,
  allRoundsData: ConstructorStandings[][] | undefined,
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

    const constructorsMap = new Map<string, string>();

    allRoundsData.forEach((round) => {
      round.forEach((c) => {
        constructorsMap.set(c.Constructor.constructorId, c.Constructor.name);
      });
    });

    const latestRound = allRoundsData[allRoundsData.length - 1] || [];

    const constructors = Array.from(constructorsMap, ([id, name]) => {
      const constructorData = latestRound.find(
        (c) => c.Constructor.constructorId === id
      );
      const points = constructorData ? Number(constructorData.points) : 0;
      return { id, name, points };
    }).sort((a, b) => b.points - a.points);

    const datasets = constructors.map((constructor) => ({
      label: constructor.name,
      data: allRoundsData.map((round) => {
        const teamData = round.find(
          (c) => c.Constructor.constructorId === constructor.id
        );
        return teamData ? Number(teamData.points) : null;
      }),

      backgroundColor: teamColorMap?.[year]?.[constructor.id],
      borderColor:
        teamColorMap?.[year]?.[constructor.id] ||
        `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    return { labels, datasets };
  }

  return { labels: [], datasets: [] };
};

const ConstructorStandingsTable = ({
  year,
  data,
  allRoundsData,
}: ConstructorStandingsTableProps) => {
  const translate = useTranslations("General");

  const graphData = buildGraphData(
    year,
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
          text: translate("constructorStandingsRoundByRound", { year }),
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
    <ResultsTable<ConstructorStandings>
      caption={`${year} ${translate("constructorStandings")}`}
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
          field: "Constructor",
          header: translate("constructor"),
          renderCell: (value) => `${value.Constructor.name}`,
          urlHref: (value) =>
            `/results/${year}/constructors/${value.Constructor.constructorId}`,
          styles: {
            columnSize: "6fr",
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
      noDataText={
        Number(year) < 1958
          ? translate.rich("noDataForConstructorsBefore58", {
              link: (chunks) => (
                <Link href="/results/1958/constructors">{chunks}</Link>
              ),
            })
          : ""
      }
      data={data}
      chartData={chartData}
    />
  );
};

export default ConstructorStandingsTable;
