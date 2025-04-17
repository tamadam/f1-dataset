import React from "react";
import MainCard from "./components/MainCard/MainCard";
import Separator from "./components/Separator/Separator";
import StoryCard, { StoryCardProps } from "./components/StoryCard/StoryCard";
import StoryVideo from "./components/StoryCard/Stories/StoryVideo";
import StoryAnimation from "./components/StoryCard/Stories/StoryAnimation";
import StoryStatistics from "./components/StoryCard/Stories/StoryStatistics";
import { drivers } from "./components/drivers";
import Faq from "../components/Faq/Faq";

export default function Home() {
  const storyCards: (StoryCardProps & { id: number })[] = [
    {
      id: 1,
      title: "Ne maradj le a lényegről.",
      description:
        "Nézd meg rövid összefoglalóinkat a nagydíjakról magyar nyelven, hogy minden fontos momentum megmaradjon.",
      children: <StoryVideo />,
    },
    {
      id: 2,
      title: "Erősorrend. Ahol csak a versenyző számít.",
      description:
        "Ez a rangsor olyan tényezők alapján, mint az aktuális versenyzői teljesítmény vagy a konzisztencia, sorrendbe állítja a versenyzőket az általuk vezetett autó teljesítményétől teljesen elvonatkoztatva.",
      children: <StoryAnimation animatedItemsList={drivers} />,
      reverse: true,
    },
    {
      id: 3,
      title: "Testreszabható statisztika",
      description:
        "Az adatok korlátlan mennyiségben állnak rendelkezésedre. Ezekből az adatokból pedig bármilyen statisztikát képes leszel összeállítani!",
      children: <StoryStatistics />,
    },
  ];

  return (
    <>
      <MainCard />
      <Separator />
      {storyCards.map((storyCard) => (
        <React.Fragment key={storyCard.id}>
          <StoryCard
            title={storyCard.title}
            description={storyCard.description}
            reverse={storyCard.reverse}
          >
            {storyCard.children}
          </StoryCard>
          <Separator />
        </React.Fragment>
      ))}
      <Faq />
      <Separator />
    </>
  );
}
