"use client";

import { useState } from "react";
import styles from "./HeaderMenu.module.scss";
import Link from "next/link";
import { ArrowRight, Burger, Close } from "@/app/components/icons";
import { MenuItem } from "@/app/types";

interface HeaderMenuProps {
  menuItems: MenuItem[];
}

const HeaderMenu = ({ menuItems }: HeaderMenuProps) => {
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
            <Close width={26} height={26} color="#ee0000" />
          ) : (
            <Burger width={26} height={26} color="#ee0000" />
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
        <div className={styles.headerItems}>
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.id}
              href={menuItem.href}
              className={styles.headerItem}
            >
              <span>{menuItem.label}</span>
              <ArrowRight width={26} height={26} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
