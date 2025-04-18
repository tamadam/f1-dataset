import clsx from "clsx";
import styles from "./Button.module.scss";
import { Link } from "@/i18n/navigation";

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
  if (href) {
    return (
      <Link
        href={href}
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
