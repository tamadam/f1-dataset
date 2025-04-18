"use client";

import useScrolledPastTop from "@/app/hooks/useScrolledPastTop";
import styles from "./BackToTopButton.module.scss";
import Button from "../Button";
import { ArrowLeft } from "../icons";

const BackToTopButton = () => {
  const displayUpButton = useScrolledPastTop(350); // show button after 350px

  const handleButtonClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return displayUpButton ? (
    <Button className={styles.backToTop} onClick={handleButtonClick}>
      <ArrowLeft width={40} height={40} className={styles.icon} />
    </Button>
  ) : null;
};

export default BackToTopButton;
