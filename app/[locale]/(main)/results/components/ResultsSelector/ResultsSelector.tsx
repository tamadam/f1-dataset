import { getAllF1YearsReverse } from "@/app/lib/year-utils";
import Selector from "./Selector";
import styles from "./ResultsSelector.module.scss";

type SelectorElements = {
  title: string;
  elements: string[] | number[] | undefined;
  urlKey: string;
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
  children: React.ReactNode;
  elementsLists: SelectorElements[];
}

const ResultsSelector = ({ children, elementsLists }: ResultsSelectorProps) => {
  const allElementsLists = [...STATIC_ELEMENTS, ...elementsLists];
  return (
    <div className={styles.resultsSelectorWrapper}>
      {allElementsLists.map((elemensList) => (
        <Selector
          key={elemensList.title}
          title={elemensList.title}
          elements={elemensList.elements}
          urlKey={elemensList.urlKey}
        />
      ))}
      {children}
    </div>
  );
};

export default ResultsSelector;
