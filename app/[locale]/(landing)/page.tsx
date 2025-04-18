import React from "react";
import MainCard from "./components/MainCard/MainCard";
import Separator from "./components/Separator/Separator";
import StoryCard, { StoryCardProps } from "./components/StoryCard/StoryCard";
import StoryVideo from "./components/StoryCard/Stories/StoryVideo";
import StoryAnimation from "./components/StoryCard/Stories/StoryAnimation";
import StoryStatistics from "./components/StoryCard/Stories/StoryStatistics";
import { drivers } from "./components/drivers";
import Faq from "../../components/Faq/Faq";
import { useTranslations } from "next-intl";

export default function Home() {
  const translation = useTranslations("LandingPage");

  const storyCards: (StoryCardProps & { id: number })[] = [
    {
      id: 1,
      title: translation("storyCards.cardVideo.storyTitle"),
      description: translation("storyCards.cardVideo.storyDescription"),
      children: <StoryVideo />,
    },
    {
      id: 2,
      title: translation("storyCards.cardAnimation.storyTitle"),
      description: translation("storyCards.cardAnimation.storyDescription"),
      children: <StoryAnimation animatedItemsList={drivers} />,
      reverse: true,
    },
    {
      id: 3,
      title: translation("storyCards.cardStatistics.storyTitle"),
      description: translation("storyCards.cardStatistics.storyDescription"),
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
