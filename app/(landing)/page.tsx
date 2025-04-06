import React from "react";
import MainCard from "./components/MainCard/MainCard";
import Separator from "./components/Separator/Separator";
import StoryCard, { StoryCardProps } from "./components/StoryCard/StoryCard";

export default function Home() {
  const storyCards: (StoryCardProps & { id: number })[] = [
    {
      id: 1,
      title: "Ne maradj le a lényegről.",
      description:
        "Nézd meg rövid összefoglalóinkat a nagydíjakról magyar nyelven, hogy minden fontos momentum megmaradjon.",
      children: <h1>Dynamic content here</h1>,
    },
    {
      id: 2,
      title: "Erősorrend. Ahol csak a versenyző számít.",
      description:
        "Ez a rangsor olyan tényezők alapján, mint az aktuális versenyzői teljesítmény vagy a konzisztencia, sorrendbe állítja a versenyzőket az általuk vezetett autó teljesítményétől teljesen elvonatkoztatva.",
      children: <h1>Dynamic content here</h1>,
      reverse: true,
    },
    {
      id: 3,
      title: "Testreszabható statisztika",
      description:
        "Az adatok korlátlan mennyiségben állnak rendelkezésedre. Ezekből az adatokból pedig bármilyen statisztikát képes leszel összeállítani!",
      children: <h1>Dynamic content here</h1>,
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
    </>
  );
}
