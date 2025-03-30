import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import styles from "./HeaderFull.module.scss";
import Image from "next/image";
import HeaderMenu from "./HeaderMenu";

const HeaderFull = () => {
  return (
    <header className={styles.fullHeader}>
      <div className={styles.headerFullWrapper}>
        <div className={styles.headerItemWrapper}>
          <div className={styles.headerItem}>
            <Image
              src="/f1DatasetLogo.svg"
              width={F1_LOGO_ORIGINAL_WIDTH / 8}
              height={F1_LOGO_ORIGINAL_HEIGHT / 8}
              alt="F1 Dataset Logo"
            />
          </div>
        </div>
        <div className={styles.headerItemWrapper}>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
};

export default HeaderFull;
