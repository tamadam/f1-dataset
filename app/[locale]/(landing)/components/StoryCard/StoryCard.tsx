import clsx from "clsx";
import styles from "./StoryCard.module.scss";

export interface StoryCardProps {
  title: string;
  description: string;
  reverse?: boolean;
  children: React.ReactNode;
}

const StoryCard = ({
  title,
  description,
  reverse = false,
  children,
}: StoryCardProps) => {
  return (
    <section className={styles.storyCardWrapper}>
      <div
        className={clsx(styles.storyCardText, reverse && styles.reverseOrder)}
      >
        <h2 className={styles.storyCardTitle}>{title}</h2>
        <p className={styles.storyCardDescription}>{description}</p>
      </div>
      <div className={styles.storyCardDynamic}>{children}</div>
    </section>
  );
};

export default StoryCard;
