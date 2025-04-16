"use client";

import { useState } from "react";
import Button from "../Button";
import { Plus } from "../icons";
import styles from "./Faq.module.scss";
import clsx from "clsx";

const FAQ_CONTENT = [
  {
    question: "Milyen statisztikák és adatok érhetőek el az oldalon?",
    answer:
      "Az oldalon Forma-1-hez kapcsolódó statisztikák és adatok széles skálája található. Ide tartozik az aktuális tabella, valamint további információk a versenyzőkről és a csapatokról, valamint egyéb hírek az F1 világából. Az adatok a legelső F1-es futamtól kezdve állnak rendelkezésre. Egyedi szűrők is alkalmazhatóak az adatokon, ezáltal a keresés személyre szabható, így könnyen elérheti az Ön számára legrelevánsabb adatokat.",
  },
  {
    question: "Milyen gyakran frissülnek ezek a statisztikák és adatok?",
    answer:
      "Az adatokat az Ergast Developer API nevű szolgáltatás biztosítja. Általában az aktuális versenyt követő néhány óra elegendő ahhoz, hogy az adatok frissítésre kerüljenek. Ezt követően az adatok és statisztikák azonnal frissülnek az oldalon.",
  },
  {
    question:
      "Beállítható, hogy csak egy adott versenyzőről vagy csapatról kapjak információt?",
    answer:
      "Igen, rendelkezésre állnak szűrő funkciók, amellyel szűkítheti az adatokat egy adott versenyzőre vagy csapatra.",
  },
  {
    question:
      "Elérhető valamilyen menetrend, ahol a közelgő versenyek és események láthatóak?",
    answer:
      "Bár a jövőben tervezünk ehhez hasonló funkció bevezetését az oldalon, jelenleg nem ez az elsődleges prioritás. Mindazonáltal mindig törekszünk a folyamatos fejlesztésre és bővítésre, ezért legyen résen és figyelje a jövőbeni frissítéseket.",
  },
];

const Faq = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.faqWrapper}>
      <h2 className={styles.faqTitle}>Gyakran ismételt kérdések</h2>
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
                    <span>{item.question}</span>
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
                  <span className={styles.faqAnswer}>{item.answer}</span>
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
