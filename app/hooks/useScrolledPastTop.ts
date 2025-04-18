import { useEffect, useState } from "react";

const useScrolledPastTop = (threshold = 100) => {
  const [scrollHitThreshold, setScrollHitThreshold] = useState<boolean>(false);

  useEffect(() => {
    
    const onScroll = () => {
        setScrollHitThreshold(window.scrollY > threshold);
    };

    onScroll(); // check on mount

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);

  }, [threshold]);

  return scrollHitThreshold;
};

export default useScrolledPastTop;