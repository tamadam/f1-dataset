"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "../Button";
import styles from "./ErrorPage.module.scss";
import { Refresh } from "../icons";

const ErrorPage = () => {
  const router = useRouter();
  const translation = useTranslations("ErrorPage");

  return (
    <div className={styles.errorPageWrapper}>
      <div className={styles.errorPageContent}>
        <h3>{translation("errorMessage")}</h3>
        <Button onClick={() => router.refresh()}>
          <Refresh />
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
