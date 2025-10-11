import { F1DatasetLogo } from "@/app/components/icons";
import styles from "./SelectorCard.module.scss";
import Selector, { SelectorProps } from "./Selector";
import Image from "next/image";

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

  const imageData = {
    src:
      backgroundType === "driver"
        ? "/images/f1-results-driver.avif"
        : "/images/car-background-selector.jpg",
    alt: backgroundType === "driver" ? "f1-driver" : "f1-car",
  };

  return (
    <div className={styles.selectorWrapper}>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        className={styles.selectorCardBackground}
        fill
      />

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
