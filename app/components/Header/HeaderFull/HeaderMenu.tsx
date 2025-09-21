"use client";

import { useEffect, useState } from "react";
import styles from "./HeaderMenu.module.scss";
import { ArrowRight, Burger, Close } from "@/app/components/icons";
import { MenuItem } from "@/app/types/header";
import Button from "../../Button/Button";
import { Link } from "@/i18n/navigation";

interface HeaderMenuProps {
  menuItems: MenuItem[];
}

const HeaderMenu = ({ menuItems }: HeaderMenuProps) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Close menu when Esc or Space pressed
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " ") {
        setMenuOpen(false);
      }
    };

    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();

    window.addEventListener("resize", updateIsMobile);

    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", updateIsMobile);
    };
  }, [isMenuOpen, setMenuOpen]);

  const isHiddenElement = isMobile && !isMenuOpen;

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
        variant="normal"
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
        aria-hidden={isHiddenElement}
      >
        <div className={styles.headerItems}>
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.id}
              href={menuItem.href}
              className={styles.headerItem}
              onClick={() => setMenuOpen(false)}
              tabIndex={isHiddenElement ? -1 : 0}
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
