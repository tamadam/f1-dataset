import Image from "next/image";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import styles from "./Footer.module.scss";
import {
  F1_LOGO_ORIGINAL_HEIGHT,
  F1_LOGO_ORIGINAL_WIDTH,
} from "@/app/constants";
import { useTranslations } from "next-intl";

const Footer = () => {
  const translation = useTranslations("General");
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className={styles.footerWrapper}>
        <div className={styles.footerTitle}>
          <Image
            src="/images/f1DatasetLogo.svg"
            width={F1_LOGO_ORIGINAL_WIDTH / 5}
            height={F1_LOGO_ORIGINAL_HEIGHT / 5}
            alt={translation("f1DatasetLogoAltText")}
          />
        </div>
        {/* <div className={styles.footerLinks}>
          <a href="#">{translation("footer.account")}</a>
          <a href="#">{translation("footer.aboutUs")}</a>
          <a href="#">{translation("footer.contactUs")}</a>
          <a href="#">{translation("footer.customerService")}</a>
        </div> */}
        <div className={styles.footerDescription}>
          {translation("footer.warningMessage")
            .replace(
              "##GitHub issue##",
              "<a href='https://github.com/tamadam/f1-dataset/issues'>GitHub issue</a>"
            )
            .split("\n")
            .map((line, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
        </div>
        <div className={styles.footerLanguageSelectorWrapper}>
          <LanguageSelector />
        </div>
        <div className={styles.copyright}>
          &copy; 2025-{currentYear} {translation("footer.copyRightText")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
