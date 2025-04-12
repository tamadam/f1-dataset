import Image from "next/image";
import styles from "./Stories.module.scss";

const StoryStatistics = () => {
  return (
    <div className={styles.storyStatisticsWrapper}>
      <Image src="/images/phone.png" alt="phone" fill />
    </div>
  );
};

export default StoryStatistics;
