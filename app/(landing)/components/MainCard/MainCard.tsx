import Image from "next/image";
import styles from "./MainCard.module.scss";
import Button from "@/app/components/Button";
import { ArrowRight } from "@/app/components/icons";

const MainCard = () => {
  return (
    <div className={styles.mainCardWrapper}>
      <div className={styles.mainBackground}>
        <Image
          src="/images/landingPageBackground.jpg"
          alt="racing f1 cars"
          fill
        />
        <div className={styles.mainBackgroundColorCover}></div>
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>
          Forma 1 adatok és elemzések korlátlan kínálata.
        </h1>
        <h3 className={styles.subtitle}>
          Bárhol nézheted. Amikor csak akarod.
        </h3>
        <div className={styles.description}>
          <p>A lámpák mindjárt kialszanak! Készen állsz?</p>
          <Button href="#" className={styles.descriptionButton}>
            <span>Felfedezés</span>
            <ArrowRight width={24} height={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
