import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import styles from "./HeaderFull.module.scss";
import Image from "next/image";
import HeaderMenu from "./HeaderMenu";
import { MenuItem } from "@/app/types/header";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const HeaderFull = async ({ currentYear }: { currentYear: number }) => {
  const translation = await getTranslations("General");

  const menuItemsList: MenuItem[] = [
    {
      id: 1,
      label: translation("results"),
      href: `/results/${currentYear}/races`,
    },
    { id: 2, label: `${translation("statistics")}`, href: "/statistics" },
    { id: 3, label: `${translation("powerRankings")} - TBD`, href: "/" },
  ];

  return (
    <header className={styles.fullHeader}>
      <div className={styles.headerFullWrapper}>
        <div className={styles.headerItemWrapper}>
          <Link tabIndex={0} href={`/`}>
            <Image
              src="/images/f1DatasetLogo.svg"
              width={F1_LOGO_ORIGINAL_WIDTH / 10}
              height={F1_LOGO_ORIGINAL_HEIGHT / 10}
              alt="F1 Dataset Logo"
              className={styles.headerItem}
              fetchPriority="high"
              priority
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
