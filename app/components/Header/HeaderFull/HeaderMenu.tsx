"use client";

import { useState } from "react";
import styles from "./HeaderMenu.module.scss";
import Link from "next/link";
import { Burger, Close } from "@/app/components/icons";

const HeaderMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      {isMenuOpen && <div className={styles.menuCover}></div>}
      <div
        className={styles.menuIcon}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span>
          {isMenuOpen ? (
            <Close width={24} height={24} color="#ee0000" />
          ) : (
            <Burger width={24} height={24} color="#ee0000" />
          )}
        </span>
      </div>
      <div
        className={
          isMenuOpen
            ? [styles.menuOptionsWrapper, styles.menuOpen].join(" ")
            : styles.menuOptionsWrapper
        }
      >
        <div className={styles.headerItem}>
          <Link href="#">Results</Link>
          <Link href="#">Statistics</Link>
          <Link href="#">Future Feature</Link>
          <Link href="#">Videos</Link>
          <Link href="#">Power Rankings</Link>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
