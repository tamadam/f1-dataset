import Image from "next/image";
import styles from "./HeaderSimple.module.scss";
import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";

const HeaderSimple = () => {
  return (
    <header className={styles.simpleHeader}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerItem}>
          <Image
            src="/f1DatasetLogo.svg"
            width={F1_LOGO_ORIGINAL_WIDTH / 8}
            height={F1_LOGO_ORIGINAL_HEIGHT / 8}
            alt="F1 Dataset Logo"
          />
        </div>
        <div className={styles.headerItem}>
          <div>Language Selector</div>
          <div>Explore Button</div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;
