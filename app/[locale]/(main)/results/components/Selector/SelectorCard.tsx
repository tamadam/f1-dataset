import { F1DatasetLogo } from "@/app/components/icons";
import styles from "./SelectorCard.module.scss";
import Selector, { SelectorProps } from "./Selector";
import clsx from "clsx";

interface SelectorPropsExtended {
  title: string;
  backgroundType?: "driver" | "car";
}

type SelectorCardProps = SelectorProps & SelectorPropsExtended;

const SelectorCard = ({
  title,
  elements,
  urlKey,
  includeAllOption,
  backgroundType = "driver",
}: SelectorCardProps) => {
  if (!elements) return null;

  return (
    <div
      className={clsx(styles.selectorWrapper, {
        [styles.driverBackground]: backgroundType === "driver",
        [styles.carBackground]: backgroundType === "car",
      })}
    >
      <div className={styles.selectorContent}>
        <div className={styles.selectorTitle}>
          <F1DatasetLogo width={40} height={40} />
          <span>{title}</span>
        </div>

        <div className={styles.selectorItems}>
          <Selector
            elements={elements}
            urlKey={urlKey}
            includeAllOption={includeAllOption}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectorCard;
