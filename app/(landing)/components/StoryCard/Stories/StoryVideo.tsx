import styles from "./Stories.module.scss";

const StoryVideo = () => {
  return (
    <div className={styles.storyVideoWrapper}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/laptop.png" alt="laptop" />
      <div className={styles.videoWrapper}>
        <video
          autoPlay
          muted
          playsInline
          loop
          poster="images/mainVideoPoster.webp"
        >
          <source src="/videos/mainVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default StoryVideo;
