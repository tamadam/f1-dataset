import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import styles from "./HeaderFull.module.scss";
import Image from "next/image";
import HeaderMenu from "./HeaderMenu";
import { MenuItem } from "@/app/types";

const HeaderFull = () => {
  const menuItemsList: MenuItem[] = [
    { id: 1, label: "Results", href: "#" },
    { id: 2, label: "Statistics", href: "#" },
    { id: 3, label: "Future Feature", href: "#" },
    { id: 4, label: "Videos", href: "#" },
    { id: 5, label: "Power Rankings", href: "#" },
  ];

  return (
    <header className={styles.fullHeader}>
      <div className={styles.headerFullWrapper}>
        <div className={styles.headerItemWrapper}>
          <div className={styles.headerItem}>
            <Image
              src="/images/f1DatasetLogo.svg"
              width={F1_LOGO_ORIGINAL_WIDTH / 8}
              height={F1_LOGO_ORIGINAL_HEIGHT / 8}
              alt="F1 Dataset Logo"
            />
          </div>
        </div>
        <div className={styles.headerItemWrapper}>
          <HeaderMenu menuItems={menuItemsList} />
        </div>
      </div>
    </header>
  );
};

export default HeaderFull;
