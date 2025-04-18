import Image from "next/image";
import styles from "./HeaderSimple.module.scss";
import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import Button from "@/app/components/Button";
import LanguageSelector from "../../LanguageSelector/LanguageSelector";
import { useTranslations } from "next-intl";

const HeaderSimple = () => {
  const translation = useTranslations("General");
  return (
    <header className={styles.simpleHeader}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerItem}>
          <Image
            src="/images/f1DatasetLogo.svg"
            width={F1_LOGO_ORIGINAL_WIDTH / 8}
            height={F1_LOGO_ORIGINAL_HEIGHT / 8}
            alt={translation("f1DatasetLogoAltText")}
          />
        </div>
        <div className={styles.headerItem}>
          <LanguageSelector horizontalAlignment="right" />
          <div>
            <Button variant="primary">
              <span>{translation("exploreButton")}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;
