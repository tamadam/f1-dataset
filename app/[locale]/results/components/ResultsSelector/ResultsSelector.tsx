import { getAllF1YearsReverse } from "@/app/lib/year-utils";
import Selector from "./Selector";

type SelectorElements = {
  title: string;
  elements: string[] | number[] | undefined;
  urlKey?: string;
};

const STATIC_ELEMENTS: SelectorElements[] = [
  {
    title: "Seasons",
    elements: getAllF1YearsReverse(),
    urlKey: "year",
  },
  {
    title: "Categories",
    elements: ["races", "drivers", "constructors", "fastest-laps"],
    urlKey: "category",
  },
];

interface ResultsSelectorProps {
  elementsLists: SelectorElements[];
}

const ResultsSelector = ({ elementsLists }: ResultsSelectorProps) => {
  const allElementsLists = [...STATIC_ELEMENTS, ...elementsLists];
  return (
    <div>
      {allElementsLists.map((elemensList) => (
        <Selector
          key={elemensList.title}
          title={elemensList.title}
          elements={elemensList.elements}
          urlKey={elemensList.urlKey}
        />
      ))}
    </div>
  );
};

export default ResultsSelector;
