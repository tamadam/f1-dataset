import Image from "next/image";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import styles from "./Footer.module.scss";
import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className={styles.footerWrapper}>
        <div className={styles.footerTitle}>
          <Image
            src="/images/f1DatasetLogo.svg"
            width={F1_LOGO_ORIGINAL_WIDTH / 5}
            height={F1_LOGO_ORIGINAL_HEIGHT / 5}
            alt="F1 Dataset Logo"
          />
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Fiók</a>
          <a href="#">Kapcsolat</a>
          <a href="#">Ügyfélszolgálat</a>
          <a href="#">Rólunk</a>
        </div>
        <div className={styles.footerDescription}>
          <span>
            Ez az oldal azért készült, hogy tapasztalatot szerezzek mind
            frontend, mind backend környezetben történő fejlesztésben különböző
            technológiákat alkalmazva. Az oldal Forma 1-el kapcsolatos
            információkat illetve adatokat bocsájt a felhasználó rendelkezésére.
            Ezen adatok nyilvánosan elérhető forrásokból származnak.
          </span>
          <p className={styles.dangerous}>
            Az oldal nem kereskedelmi vagy pénzbeli haszonszerzés céljából jött
            létre.
          </p>
        </div>
        <div className={styles.footerLanguageSelectorWrapper}>
          <LanguageSelector />
        </div>
        <div className={styles.copyright}>
          &copy; {currentYear} F1 Dataset Hungary.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
