"use client";

import { useEffect, useState } from "react";
import styles from "./HeaderMenu.module.scss";
import Link from "next/link";
import { ArrowRight, Burger, Close } from "@/app/components/icons";
import { MenuItem } from "@/app/types";
import Button from "../../Button/Button";

interface HeaderMenuProps {
  menuItems: MenuItem[];
}

const HeaderMenu = ({ menuItems }: HeaderMenuProps) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  // Close menu when Esc or Space pressed
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " ") {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isMenuOpen, setMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          className={styles.menuCover}
          onClick={() => setMenuOpen((prev) => !prev)}
        ></div>
      )}
      <Button
        className={styles.menuIcon}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle Navigation"
        tabIndex={0}
      >
        <span>
          {isMenuOpen ? (
            <Close width={26} height={26} color="#ee0000" />
          ) : (
            <Burger width={26} height={26} color="#ee0000" />
          )}
        </span>
      </Button>
      <div
        className={
          isMenuOpen
            ? [styles.menuOptionsWrapper, styles.menuOpen].join(" ")
            : styles.menuOptionsWrapper
        }
        aria-label="Primary Navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.headerItems}>
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.id}
              href={menuItem.href}
              className={styles.headerItem}
            >
              <span>{menuItem.label}</span>
              <span className={styles.headerItemIcon}>
                <ArrowRight width={26} height={26} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
