"use client";

import { useState } from "react";
import Button from "../Button";
import { Plus } from "../icons";
import styles from "./Faq.module.scss";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

const Faq = () => {
  const translation = useTranslations("LandingPage");

  const FAQ_CONTENT = [
    {
      question: translation("faq.question1"),
      answer: translation("faq.question1Answer"),
    },
    {
      question: translation("faq.question2"),
      answer: translation("faq.question2Answer"),
    },
    {
      question: translation("faq.question3"),
      answer: translation("faq.question3Answer"),
    },
    {
      question: translation("faq.question4"),
      answer: translation("faq.question4Answer"),
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.faqWrapper}>
      <h2 className={styles.faqTitle}>{translation("faq.faqTitle")}</h2>
      <div className={styles.faqQuestionsWrapper}>
        <ul>
          {FAQ_CONTENT.map((item, index) => {
            const currentIndex = selectedIndex === index;
            return (
              <li key={index} className={styles.faqLi}>
                <h3
                  className={styles.faqQuestionWrapper}
                  onClick={() =>
                    setSelectedIndex(index === selectedIndex ? -1 : index)
                  }
                >
                  <Button variant="normal" className={styles.faqQuestion}>
                    <span className={styles.faqQuestionContent}>
                      {item.question}
                    </span>
                    <Plus
                      width={24}
                      height={24}
                      className={clsx(styles.questionIcon, {
                        [styles.rotate]: currentIndex,
                      })}
                    />
                  </Button>
                </h3>
                <div
                  className={clsx(styles.faqAnswerWrapper, {
                    [styles.activeItem]: currentIndex,
                  })}
                >
                  <span className={styles.faqAnswer}>
                    {item.answer
                      .split("###LINEBREAK###")
                      .map((line, index, lines) => (
                        <Fragment key={index}>
                          {line}
                          {index < lines.length - 1 && (
                            <>
                              <br />
                              <br />
                            </>
                          )}
                        </Fragment>
                      ))}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Faq;
