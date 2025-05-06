import { PropsWithChildren } from "react";
import styles from "./ContentWrapper.module.scss";

const ContentWrapper = ({ children }: PropsWithChildren) => {
  return <div className={styles.contentWrapper}>{children}</div>;
};

export default ContentWrapper;
