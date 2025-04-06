import clsx from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary";
}

const Button = ({ children, variant, className, ...props }: ButtonProps) => {
  return (
    <button className={clsx(styles.btn, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
