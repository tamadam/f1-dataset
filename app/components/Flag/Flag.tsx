import Image from "next/image";
import styles from "./Flag.module.scss";

interface FlagProps {
  countryCode: string;
  width?: string;
  height?: string;
}

const Flag = ({ countryCode, width = "2em", height = "2em" }: FlagProps) => {
  return (
    <div className={styles.flagWrapper} style={{ width, height }}>
      <Image
        src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${countryCode}.svg`}
        alt="Flag representing the country"
        fill
      />
    </div>
  );
};

export default Flag;
