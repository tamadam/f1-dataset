import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import styles from "./HeaderFull.module.scss";
import Image from "next/image";
import HeaderMenu from "./HeaderMenu";
import { MenuItem } from "@/app/types/header";
import { Link } from "@/i18n/navigation";
import { getCurrentYear } from "@/app/lib/year-utils";
import { useTranslations } from "next-intl";

const HeaderFull = () => {
  const year = getCurrentYear();
  const translate = useTranslations("General");

  const menuItemsList: MenuItem[] = [
    { id: 1, label: translate("results"), href: `/results/${year}/drivers` },
    { id: 2, label: `${translate("statistics")} - TBD`, href: "/" },
    { id: 3, label: `${translate("powerRankings")} - TBD`, href: "/" },
  ];

  return (
    <header className={styles.fullHeader}>
      <div className={styles.headerFullWrapper}>
        <div className={styles.headerItemWrapper}>
          <Link tabIndex={0} href={`/`}>
            <Image
              src="/images/f1DatasetLogo.svg"
              width={F1_LOGO_ORIGINAL_WIDTH / 8}
              height={F1_LOGO_ORIGINAL_HEIGHT / 8}
              alt="F1 Dataset Logo"
              className={styles.headerItem}
            />
          </Link>
        </div>
        <div className={styles.headerItemWrapper}>
          <HeaderMenu menuItems={menuItemsList} />
        </div>
      </div>
    </header>
  );
};

export default HeaderFull;
