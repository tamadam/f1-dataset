"use client";

import clsx from "clsx";
import styles from "./Button.module.scss";

import { useParams } from "next/navigation";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "normal";
  href?: string;
}

const Button = ({
  children,
  variant = "primary",
  href = "",
  className,
  ...props
}: ButtonProps) => {
  const params = useParams();
  const locale = params.locale || "en";
  if (href) {
    return (
      <Link
        href={`${locale}/${href}`}
        className={clsx(styles.link, styles[variant], className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={clsx(styles.btn, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
