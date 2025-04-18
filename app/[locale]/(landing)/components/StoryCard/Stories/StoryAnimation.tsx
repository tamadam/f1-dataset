"use client";

import { CSSProperties } from "react";
import { AnimatedItem } from "../../../types";
import styles from "./Stories.module.scss";
import { useInView } from "../../../../../hooks/useInView";
import clsx from "clsx";

export interface StoryAnimationProps {
  animatedItemsList: AnimatedItem[];
}

const StoryAnimation = ({ animatedItemsList }: StoryAnimationProps) => {
  const { ref, isInView } = useInView({ threshold: 0.4 });

  return (
    <div className={styles.storyAnimationWrapper} ref={ref}>
      <div className={styles.animatedItemsWrapper}>
        {animatedItemsList.map((animatedItem, index) => (
          <div className={styles.animatedItemWrapper} key={index}>
            <div
              className={clsx(styles.animatedItem, {
                [styles.animateLine]: isInView,
              })}
              style={
                {
                  background: animatedItem.lineColor,
                  ...(isInView && {
                    "--line-width":
                      animatedItem.value > 0 && animatedItem.value <= 10
                        ? `${Math.round(animatedItem.value * 10)}%`
                        : "30%",
                  }),
                  "--bg-after": `url(${animatedItem.avatarUrl})`,
                } as CSSProperties
              }
            />
            <div
              className={clsx(styles.animatedItemValue, {
                [styles.animateValue]: isInView && index === 0,
              })}
            >
              {animatedItem.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryAnimation;
