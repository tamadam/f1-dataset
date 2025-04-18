import Image from "next/image";
import styles from "./MainCard.module.scss";
import Button from "@/app/components/Button";
import { ArrowRight } from "@/app/components/icons";
import { useTranslations } from "next-intl";

const MainCard = () => {
  const translation = useTranslations("LandingPage");
  const generalTranslation = useTranslations("General");

  return (
    <div className={styles.mainCardWrapper}>
      <div className={styles.mainBackground}>
        <Image
          src="/images/landingPageBackground.jpg"
          alt={translation("mainCard.imageAltText")}
          fill
        />
        <div className={styles.mainBackgroundColorCover}></div>
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>{translation("mainCard.mainTitle")}</h1>
        <h3 className={styles.subtitle}>
          {translation("mainCard.mainSubtitle")}
        </h3>
        <div className={styles.description}>
          <p>{translation("mainCard.mainDescription")}</p>
          <Button href="#" className={styles.descriptionButton}>
            <span>{generalTranslation("exploreButton")}</span>
            <ArrowRight width={24} height={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
