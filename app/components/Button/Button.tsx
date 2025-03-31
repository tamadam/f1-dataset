import clsx from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={clsx(styles.btn, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
